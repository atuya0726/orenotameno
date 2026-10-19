const modelFiles = new Set([
  'config.json', 'generation_config.json', 'preprocessor_config.json',
  'tokenizer.json', 'tokenizer_config.json', 'special_tokens_map.json',
  'vocab.json', 'merges.txt', 'normalizer.json', 'added_tokens.json',
  'onnx/encoder_model_quantized.onnx', 'onnx/decoder_model_merged_quantized.onnx',
]);

// Public model files only. Never accept an upstream URL or forward user cookies,
// credentials, audio, or arbitrary Hub paths through this endpoint.
export async function speechModel(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const match = /^\/api\/speech-models\/onnx-community\/whisper-(tiny|base)\/resolve\/main\/(.+)$/.exec(url.pathname);
  if (!match || !modelFiles.has(match[2]) || url.search) return new Response('Model file not found', { status: 404 });
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('GET or HEAD required', { status: 405, headers: { Allow: 'GET, HEAD' } });
  const upstreamUrl = `https://huggingface.co/onnx-community/whisper-${match[1]}/resolve/main/${match[2]}`;
  try {
    const upstream = await fetch(upstreamUrl, { method: request.method, redirect: 'follow', signal: request.signal, headers: { 'Accept-Encoding': 'identity' } });
    const headers = new Headers({ 'X-Content-Type-Options': 'nosniff', 'Cache-Control': upstream.ok ? 'public, max-age=86400' : 'no-store' });
    if (!upstream.ok) {
      await upstream.body?.cancel();
      return new Response(`Model download failed: HTTP ${upstream.status}`, { status: upstream.status === 404 ? 404 : 502, headers });
    }
    for (const name of ['Content-Type', 'Content-Length', 'ETag', 'Last-Modified']) {
      if (name === 'Content-Length' && upstream.headers.has('Content-Encoding')) continue;
      const value = upstream.headers.get(name); if (value) headers.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  } catch {
    return new Response('Model download is unavailable. Please retry.', { status: 502, headers: { 'Cache-Control': 'no-store' } });
  }
}
