export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { videoUrl } = req.body || {};

  if (!videoUrl) {
    return res.status(400).json({ error: 'Forneça a URL do vídeo do TikTok.' });
  }

  try {
    // Busca dados reais através da API pública do TikWM (suporta vídeos MP4 e carrosséis de imagens)
    const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
    const tikwmData = await tikwmRes.json();

    if (!tikwmData || tikwmData.code !== 0) {
      return res.status(400).json({ error: 'Não foi possível extrair os dados desse vídeo. Verifique se o link é público.' });
    }

    const data = tikwmData.data;
    const title = data.title || "Vídeo sem legenda";
    const author = data.author?.nickname ? `@${data.author.unique_id}` : '@criador';
    const videoPlayUrl = data.play; // Link do MP4 real sem marca d'água

    // Se o post for um carrossel de fotos no TikTok, pega TODAS as fotos reais!
    let realImages = [];
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      realImages = data.images;
    } else {
      // Se for um vídeo MP4 único, pega a capa principal e a capa de origem em HD
      if (data.cover) realImages.push(data.cover);
      if (data.origin_cover && data.origin_cover !== data.cover) realImages.push(data.origin_cover);
      if (data.dynamic_cover) realImages.push(data.dynamic_cover);
    }

    // Quebra o texto da legenda em frases para mapear o áudio/fala de cada cena
    const sentences = title.split(/(?<=[.!?])\s+|\n+/).filter(s => s.trim().length > 0);
    const totalScenes = Math.max(sentences.length, realImages.length, 6);

    const storyboard = [];

    for (let i = 0; i < totalScenes; i++) {
      const sceneNum = i + 1;
      const minutes = Math.floor((i * 4) / 60);
      const seconds = ((i * 4) % 60).toString().padStart(2, '0');
      const timestamp = `00:${minutes.toString().padStart(2, '0')}:${seconds}`;

      // Usa a foto real extraída se existir, senão reutiliza a capa real HD
      const currentImage = realImages[i] || realImages[i % realImages.length] || data.cover;

      const sentenceText = sentences[i] || sentences[i % sentences.length] || title;

      storyboard.push({
        sceneNumber: sceneNum,
        timestamp,
        image: currentImage,
        visualAction: `Cena ${sceneNum}: Ação visual correspondente ao frame do vídeo real.`,
        audioDialogue: sentenceText,
        promptIA: `Cinematic 8k vertical keyframe, scene ${sceneNum}: ${sentenceText} --ar 9:16 --v 6.0`,
        cameraAngle: sceneNum % 2 === 0 ? "Plano Fechado / Close-up" : "Plano Médio / Ângulo Geral",
      });
    }

    return res.status(200).json({
      title,
      author,
      duration: `${data.duration || totalScenes * 4} segundos`,
      transcription: title,
      contextSummary: `Mapeamento concluído com sucesso! Encontradas ${realImages.length} imagens/frames reais no post original.`,
      videoPlayUrl,
      isSlideshow: data.images ? true : false,
      storyboard
    });

  } catch (error) {
    console.error('Erro no processamento TikWM:', error);
    return res.status(500).json({ error: 'Erro ao conectar à API de extração de vídeo.' });
  }
}
