import React, { useState } from "react";
import axios from "axios";

const YOUR_API_KEY = process.env.NEXT_PUBLIC_MESHY_KEY;

const TextTo3DComponent = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTextTo3D = async () => {
    console.log(YOUR_API_KEY);
    const headers = { Authorization: `Bearer ${YOUR_API_KEY}` };
    const payload = {
      mode: "preview",
      prompt: "a monster mask",
      art_style: "realistic",
      negative_prompt: "low quality, low resolution, low poly, ugly",
    };

    try {
      const response = await axios.post(
        "https://api.meshy.ai/v2/text-to-3d",
        payload,
        { headers }
      );
      setResult(response.data);
      setError(null);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleTextTo3D}>Convert Text to 3D</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default TextTo3DComponent;
