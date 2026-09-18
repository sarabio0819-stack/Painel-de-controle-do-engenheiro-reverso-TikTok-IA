import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('storyboard');
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: url }),
      });
      const result = await response.json();
      if (response.ok) {
        setData(result);
      } else {
        alert(result.error || 'Erro ao processar o vídeo.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white pb-20">
      <Head>
        <title>TikTok AI - Mapeador e Engenharia Reversa</title>
      </Head>

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-lg text-white">
              IA
            </div>
            <div>
              <h1 className="font-bold text-slate-100 text-base leading-none">Mapeador TikTok IA</h1>
              <p className="text-xs text-slate-400 mt-1">Engenharia Reversa & Storyboard</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Sistema Ativo
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Input Bar */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="max-w-3xl mx-auto space-y-4 text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              Desconstruir Vídeo do TikTok
            </h2>
            <p className="text-sm text-slate-400">
              Cole o link do vídeo para extrair as imagens âncoras reais, transcrição completa do áudio, contexto e storyboard para modelagem.
            </p>

            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="url"
                required
                placeholder="https://www.tiktok.com/@usuario/video/123456789..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl transition shadow-lg shadow-indigo-600/30 whitespace-nowrap text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analisando Vídeo...</span>
                  </>
                ) : (
                  <span>Mapear Vídeo</span>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Dashboard de Resultados */}
        {data && (
          <div className="space-y-6">
            
            {/* Abas de Navegação / Tabs */}
            <div className="flex border-b border-slate-800 gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveTab('storyboard')}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === 'storyboard'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                🎬 Storyboard Mapeado
              </button>
              <button
                onClick={() => setActiveTab('ancoras')}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === 'ancoras'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                🖼️ Imagens Âncoras
              </button>
              <button
                onClick={() => setActiveTab('transcricao')}
                className={`px-5 py-3 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                  activeTab === 'transcricao'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                📝 Contexto & Transcrição Exata
              </button>
            </div>

            {/* ABA 1: STORYBOARD */}
            {activeTab === 'storyboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.storyboard.map((item, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition">
                      <div className="relative aspect-video bg-slate-950">
                        <img src={item.image} alt={`Frame ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono border border-slate-800 text-slate-300">
                          {item.timestamp}
                        </span>
                        <span className="absolute top-3 right-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          {item.aiModel}
                        </span>
                      </div>
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">Ação da Cena:</span>
                          <p className="text-sm text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                            {item.action}
                          </p>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block pt-1">Fala Equivalente:</span>
                          <p className="text-xs text-slate-300 italic">"{item.speech}"</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ABA 2: IMAGENS ÂNCORAS */}
            {activeTab === 'ancoras' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.storyboard.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-5 space-y-4">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img src={item.image} alt={`Âncora ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-indigo-400 block">Prompt Recomendado para Recriar a Imagem Âncora:</span>
                      <p className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-slate-300 select-all">
                        {item.prompt}
                      </p>
                    </div>
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 rounded-xl text-center font-medium transition"
                    >
                      Abrir Imagem Âncora em Alta Resolução ↗
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* ABA 3: CONTEXTO & TRANSCRIÇÃO */}
            {activeTab === 'transcricao' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wider">Transcrição Exata do Áudio</h3>
                    <button
                      onClick={() => copyToClipboard(data.transcription)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition"
                    >
                      {copied ? 'Copiado!' : 'Copiar Texto'}
                    </button>
                  </div>
                  <p className="text-slate-200 text-base leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 italic">
                    "{data.transcription}"
                  </p>
                  <div className="pt-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Resumo de Contexto do Vídeo:</h4>
                    <p className="text-xs text-slate-300 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                      {data.summary}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                  <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wider border-b border-slate-800 pb-3">Métricas & Dados</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-1 font-semibold">Autor:</span>
                      <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-mono">{data.author}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-semibold">Duração do Vídeo:</span>
                      <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200 font-mono">{data.duration}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1 font-semibold">Gancho Verbal (Hook):</span>
                      <p className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-200">{data.hooks.verbal}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
