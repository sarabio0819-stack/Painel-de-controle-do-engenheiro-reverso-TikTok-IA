import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20">
      <Head>
        <title>Diretor & Produtor de Vídeos IA - Storyboard</title>
      </Head>

      {/* Topo / Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30">
              🎬
            </div>
            <div>
              <h1 className="font-bold text-sm md:text-base text-white">Diretor & Produtor de Vídeos IA</h1>
              <p className="text-xs text-slate-400">Engenharia Reversa & Grade de Storyboards</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-8 space-y-8">
        
        {/* Caixa de Entrada */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto space-y-4 text-center">
            <h2 className="text-xl md:text-3xl font-extrabold text-white">
              Insira o Vídeo para Mapear a Produção
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                required
                placeholder="https://www.tiktok.com/@usuario/video/123456789..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap shadow-lg shadow-indigo-600/30"
              >
                {loading ? 'Mapeando Cenas...' : 'Gerar Storyboard Completo'}
              </button>
            </div>
          </form>
        </section>

        {/* Dashboard do Diretor */}
        {data && (
          <div className="space-y-8">
            
            {/* Painel de Contexto do Vídeo */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 gap-2">
                <div>
                  <h2 className="text-lg font-bold text-indigo-400">Dados Gerais & Contexto da Produção</h2>
                  <p className="text-xs text-slate-400">Criador original: {data.author} | Duração: {data.duration}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                  {data.storyboard.length} Cenas Geradas
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-semibold block uppercase">Resumo / Contexto Narrativo:</span>
                  <p className="text-slate-300 leading-relaxed">{data.contextSummary}</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-indigo-400 font-semibold block uppercase">Transcrição / Legenda Original:</span>
                  <p className="text-slate-300 italic leading-relaxed">"{data.transcription}"</p>
                </div>
              </div>
            </div>

            {/* Titulo da Grade estilo Codex */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🎥 Storyboard de Produção</span>
                <span className="text-xs font-normal text-slate-400">({data.storyboard.length} quadros no formato 9:16)</span>
              </h3>
            </div>

            {/* Grade Contínua de Quadros (5 colunas no desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {data.storyboard.map((scene) => (
                <div key={scene.sceneNumber} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-indigo-500/50 transition shadow-lg">
                  
                  {/* Frame Vertical 9:16 */}
                  <div className="relative aspect-[9/16] bg-slate-950">
                    <img src={scene.image} alt={`Cena ${scene.sceneNumber}`} className="w-full h-full object-cover" />
                    
                    {/* Indicadores no topo */}
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800 text-slate-300">
                      Cena {scene.sceneNumber}
                    </div>
                    <div className="absolute top-2 right-2 bg-indigo-600/90 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {scene.timestamp}
                    </div>
                  </div>

                  {/* Detalhes da Cena e Ação */}
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between text-[11px]">
                    <div className="space-y-1.5">
                      <span className="text-indigo-400 font-bold block">{scene.cameraAngle}</span>
                      
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Ação Visual:</span>
                        <p className="text-slate-200 line-clamp-3 bg-slate-950 p-2 rounded border border-slate-800">
                          {scene.visualAction}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Áudio / Fala:</span>
                        <p className="text-slate-300 italic line-clamp-2">
                          {scene.audioDialogue}
                        </p>
                      </div>
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <span className="text-[9px] text-slate-500 font-mono block truncate" title={scene.promptIA}>
                        Prompt: {scene.promptIA}
                      </span>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
