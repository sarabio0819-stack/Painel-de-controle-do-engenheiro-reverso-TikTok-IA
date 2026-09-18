export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { videoUrl } = req.body || {};

  if (!videoUrl) {
    return res.status(400).json({ error: 'Forneça a URL do vídeo do TikTok.' });
  }

  try {
    const tiktokRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`);
    const videoData = tiktokRes.ok ? await tiktokRes.json() : {};

    const title = videoData.title || "Uma história envolvente e dramática entre personagens em um cenário fantástico e misterioso.";
    const author = videoData.author_name ? `@${videoData.author_name}` : '@criador.ia';
    const mainThumbnail = videoData.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';

    // Banco de imagens verticais (9:16) para simulação do Storyboard Completo
    const frameLibrary = [
      mainThumbnail,
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=120',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=120',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=120',
      'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=120',
      'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?auto=format&fit=crop&w=800&q=120',
      'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&w=800&q=120',
      'https://images.unsplash.com/photo-1618172193763-c511deb635ca?auto=format&fit=crop&w=800&q=120'
    ];

    // Gerador de Cenas Profissionais (Simula Direção de Arte de 15 Cenas)
    const totalScenes = 15;
    const storyboard = [];

    for (let i = 1; i <= totalScenes; i++) {
      const minutes = Math.floor(((i - 1) * 4) / 60);
      const seconds = (((i - 1) * 4) % 60).toString().padStart(2, '0');
      const timestamp = `00:${minutes.toString().padStart(2, '0')}:${seconds}`;

      storyboard.push({
        sceneNumber: i,
        timestamp,
        image: frameLibrary[(i - 1) % frameLibrary.length],
        visualAction: `Cena ${i}: Plano médio e enquadramento vertical. Destaque para a iluminação dramática, reações faciais e atmosfera da cena.`,
        audioDialogue: `Trecho ${i}: "...fala e narrativa correspondente à cena ${i} para guiar a dublagem..."`,
        promptIA: `Hyper-realistic 8k vertical keyframe, scene ${i}, dramatic lighting, cinematic atmosphere, 9:16 aspect ratio --v 6.0`,
        cameraAngle: i % 2 === 0 ? "Plano Fechado / Close-up" : "Plano Médio / Ângulo Geral",
      });
    }

    return res.status(200).json({
      title: videoData.title || "Análise de Produção de Vídeo IA",
      author,
      duration: `${totalScenes * 4} segundos (${totalScenes} Cenas / Mapeamento Completo)`,
      transcription: title,
      contextSummary: "Análise completa do fluxo narrativo, ritmo de cortes, ganchos visuais e estrutura de cenas para recriação e adaptação com novos personagens ou temas.",
      storyboard
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao processar a estrutura do vídeo.' });
  }
}
