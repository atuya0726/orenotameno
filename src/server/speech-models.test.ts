import { afterEach, describe, expect, it, vi } from 'vitest';
import worker from '../worker';

const root = 'https://app.test/api/speech-models/onnx-community/whisper-tiny/resolve/main/';
afterEach(() => vi.unstubAllGlobals());
describe('Whisper model downloads', () => {
  it('streams model bytes without forwarding browser credentials or requiring an API key', async () => {
    const bytes = new Uint8Array([0, 1, 2, 255]);
    const fetcher = vi.fn().mockResolvedValue(new Response(bytes, { headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': '4', 'Set-Cookie': 'upstream=private' } }));
    vi.stubGlobal('fetch', fetcher);
    const response = await worker.fetch(new Request(`${root}onnx/encoder_model_quantized.onnx`, { headers: { Cookie: 'session=private', Authorization: 'Bearer private' } }), {});
    expect(response.status).toBe(200);
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(bytes);
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=86400');
    expect(response.headers.get('Content-Length')).toBe('4');
    expect(response.headers.has('Set-Cookie')).toBe(false);
    expect(fetcher).toHaveBeenCalledWith('https://huggingface.co/onnx-community/whisper-tiny/resolve/main/onnx/encoder_model_quantized.onnx', expect.objectContaining({ method: 'GET', redirect: 'follow' }));
    expect(fetcher.mock.calls[0][1].headers).toEqual({ 'Accept-Encoding': 'identity' });
  });
  it('supports HEAD and base model metadata', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(null, { headers: { 'Content-Length': '1500' } })); vi.stubGlobal('fetch', fetcher);
    const response = await worker.fetch(new Request(`${root.replace('whisper-tiny', 'whisper-base')}config.json`, { method: 'HEAD' }), {});
    expect(response.status).toBe(200); expect(await response.text()).toBe('');
    expect(fetcher.mock.calls[0][1].method).toBe('HEAD');
  });
  it('rejects arbitrary models, revisions, files, query URLs and uploads before fetching', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    for (const url of [root.replace('whisper-tiny', 'whisper-large') + 'config.json', root.replace('/main/', '/other/') + 'config.json', root + 'secrets.txt', root + 'config.json?url=https://elsewhere.test', root + 'onnx/encoder_model.onnx']) {
      expect((await worker.fetch(new Request(url), {})).status).toBe(404);
    }
    expect((await worker.fetch(new Request(root + 'config.json', { method: 'POST', body: 'audio' }), {})).status).toBe(405);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('does not cache upstream failures or expose upstream error bodies', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('private provider details', { status: 429 })));
    const response = await worker.fetch(new Request(root + 'config.json'), {});
    expect(response.status).toBe(502); expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.text()).toBe('Model download failed: HTTP 429');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect((await worker.fetch(new Request(root + 'config.json'), {})).status).toBe(502);
  });
});
