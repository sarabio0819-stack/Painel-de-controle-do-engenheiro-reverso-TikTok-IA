export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { videoUrl } = req.body || {};

  if (!videoUrl) {
    return res.status(400).json({ error: 'Forneça a URL do vídeo do TikTok.' });
  }

  try {
    // API pública para extração dos dados reais e link direto do MP4
    const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
    const tikwmData = await tikwmRes.json();

    if (!tikwmData || tikwmData.code !== 0) {
      return res.status(400).json({ error: 'Não foi possível extrair os dados desse vídeo. Verifique se o link é público.' });
    }

    const data = tikwmData.data;
    const title = data.title || "Vídeo sem legenda";
    const author = data.author?.nickname ? `@${data.author.unique_id}` : '@criador';
    const videoPlayUrl = data.play; // Link direto do MP4 HD sem marca d'água
    const durationSec = data.duration || 30;

    // Se for carrossel de imagens, pega todas as fotos reais
    let realImages = [];
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      realImages = data.images;
    } else {
      // Se for vídeo MP4, recolhe as capas disponíveis
      if (data.cover) realImages.push(data.cover);
      if (data.origin_cover) realImages.push(data.origin_cover);
      if (data.dynamic_cover) realImages.push(data.dynamic_cover);
    }

    // Quebra a legenda por frases para associar a cada cena
    const sentences = title.split(/(?<=[.!?])\s+|\n+/).filter(s => s.trim().length > 0);
    const totalScenes = realImages.length > 1 ? realImages.length : 12;
    const interval = durationSec / totalScenes;

    const storyboard = [];

    for (let i = 0; i < totalScenes; i++) {
      const sceneNum = i + 1;
      const currentSec = Math.floor(i * interval);
      const minutes = Math.floor(currentSec / 60);
      const seconds = (currentSec % 60).toString().padStart(2, '0');
      const timestamp = `00:${minutes.toString().padStart(2, '0')}:${seconds}`;

      const sentenceText = sentences[i] || sentences[i % sentences.length] || title;
      
      // Utiliza imagem da galeria se existir
      const currentImage = realImages[i] || data.cover;

      storyboard.push({
        sceneNumber: sceneNum,
        timestamp,
        timeInSeconds: currentSec,
        image: currentImage,
        visualAction: `Cena ${sceneNum} (${timestamp}): Ação visual dramática correspondente a este momento do vídeo.`,
        audioDialogue: sentenceText,
        promptIA: `Cinematic 8k keyframe, scene ${sceneNum}: ${sentenceText} --ar 9:16 --v 6.0`,
        cameraAngle: sceneNum % 2 === 0 ? "Plano Fechado / Close-up" : "Plano Médio / Ângulo Geral",
      });
    }

    return res.status(200).json({
      title,
      author,
      duration: `${durationSec} segundos (${totalScenes} Cenas Mapeadas)`,
      transcription: title,
      contextSummary: `Mapeamento da estrutura narrativa e tempos de corte para o vídeo de ${author}.`,
      videoPlayUrl,
      isSlideshow: data.images ? true : false,
      storyboard
    });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao conectar à API de extração de vídeo.' });
  }
}
