import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { DoctorSearchResult, GroundingPlace, KnowledgeItem } from "../types";

const apiKey = import.meta.env.VITE_API_KEY || '';
// 驗證 API 金鑰是否存在
if (!apiKey) {
  console.error('⚠️ VITE_API_KEY 未設定！請檢查 .env.local 檔案');
} else {
  console.log('✅ API 金鑰已載入 (長度:', apiKey.length, ')');
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Analyzes an image using Gemini 3 Pro Preview.
 * Ideal for TCM diagnosis assistance or herb identification.
 */
export const analyzeImage = async (
  base64Data: string, 
  mimeType: string, 
  promptText: string
): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: promptText || "Analyze this image in the context of Traditional Chinese Medicine. Identify herbs, or potential health indicators if it's a tongue/face photo."
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    return response.text || "無法生成分析結果。";
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("圖片分析失敗，請稍後再試。");
  }
};

/**
 * Edits an image using Gemini 2.5 Flash Image.
 */
export const editImage = async (
  base64Data: string,
  mimeType: string,
  editPrompt: string
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash-image';

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: editPrompt
          }
        ]
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated.");
  } catch (error) {
    console.error("Image editing failed:", error);
    throw new Error("圖片編輯失敗，請稍後再試。");
  }
};

/**
 * Chat with TCM AI Assistant using Gemini 2.5 Flash.
 */
let chatSession: Chat | null = null;

export const sendMessageToAI = async (message: string, history: {role: string, parts: {text: string}[]}[] = []): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "你是一位專業、友善的中醫健康顧問 (AI Health Assistant)。你的名字是 O.M.I.H 東方醫智館小助手。請根據中醫理論（陰陽五行、臟腑經絡等）回答用戶的健康問題。提供建議時請務必強調「這不是醫療診斷，僅供參考」。若遇到緊急或嚴重症狀，請建議用戶立即就醫。",
      },
      history: history.map(h => ({
        role: h.role,
        parts: h.parts
      }))
    });

    const response = await chat.sendMessage({ message });
    return response.text || "抱歉，我現在無法回答。";
  } catch (error) {
    console.error("Chat failed:", error);
    throw new Error("連線失敗，請檢查網路。");
  }
};

/**
/**
 * Analyzes body constitution based on user input using Gemini Flash.
 */
export const analyzeConstitution = async (data: any): Promise<string> => {
  try {
    const prompt = `請根據以下用戶描述，進行詳細的中醫體質辨識分析：
- 精力狀況: ${data.energy || '未填寫'}
- 冷熱偏好: ${data.temperature || '未填寫'}
- 睡眠品質: ${data.sleep || '未填寫'}
- 情緒狀態: ${data.mood || '未填寫'}
- 食慾與消化: ${data.appetite || '未填寫'}
- 其他症狀: ${data.other || '無'}

請判斷用戶最可能屬於中醫九大體質中的哪一種（平和質、氣虛質、陽虛質、陰虛質、痰濕質、濕熱質、血瘀質、氣鬱質、特稟質）。

請嚴格按照以下JSON格式回傳，不要包含任何其他文字或markdown標記：
{
  "type": "體質名稱",
  "description": "詳細的體質特徵說明，包含此體質的典型表現和特點",
  "advice": "具體的養生建議，包含飲食調理、運動方式、生活作息等實用建議"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("API 回應為空");
    }

    // 清理可能的 markdown 標記
    const cleanedText = responseText.replace(/```json\n?|```\n?/g, '').trim();
    
    // 驗證 JSON 格式
    try {
      const parsed = JSON.parse(cleanedText);
      if (!parsed.type || !parsed.description || !parsed.advice) {
        throw new Error("回應格式不完整");
      }
      return cleanedText;
    } catch (parseError) {
      console.error("JSON 解析失敗:", parseError, "原始回應:", responseText);
      // 如果 JSON 解析失敗，返回預設格式
      return JSON.stringify({
        type: "體質分析中",
        description: "系統正在分析您的體質特徵，請稍後再試或聯絡客服協助。",
        advice: "建議保持規律作息，均衡飲食，適量運動。如有不適請諮詢專業中醫師。"
      });
    }
  } catch (error: any) {
    console.error("Constitution analysis failed:", error);
    throw new Error(`體質分析失敗：${error.message || '請檢查網路連線或稍後再試'}`);
  }
};
 */
export const analyzeConstitution = async (data: any): Promise<string> => {
  try {
    const prompt = `請根據以下用戶描述，進行詳細的中醫體質辨識分析：
- 精力狀況: ${data.energy || '未填寫'}
- 冷熱偏好: ${data.temperature || '未填寫'}
- 睡眠品質: ${data.sleep || '未填寫'}
- 情緒狀態: ${data.mood || '未填寫'}
- 食慾與消化: ${data.appetite || '未填寫'}
- 其他症狀: ${data.other || '無'}

請判斷用戶最可能屬於中醫九大體質中的哪一種（平和質、氣虛質、陽虛質、陰虛質、痰濕質、濕熱質、血瘀質、氣鬱質、特稟質）。

請嚴格按照以下JSON格式回傳，不要包含任何其他文字或markdown標記：
{
  "type": "體質名稱",
  "description": "詳細的體質特徵說明，包含此體質的典型表現和特點",
  "advice": "具體的養生建議，包含飲食調理、運動方式、生活作息等實用建議"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("API 回應為空");
    }

    // 清理可能的 markdown 標記
    const cleanedText = responseText.replace(/```json\n?|```\n?/g, '').trim();
    
    // 驗證 JSON 格式
    try {
      const parsed = JSON.parse(cleanedText);
      if (!parsed.type || !parsed.description || !parsed.advice) {
        throw new Error("回應格式不完整");
      }
      return cleanedText;
    } catch (parseError) {
      console.error("JSON 解析失敗:", parseError, "原始回應:", responseText);
      // 如果 JSON 解析失敗，返回預設格式
      return JSON.stringify({
        type: "體質分析中",
        description: "系統正在分析您的體質特徵，請稍後再試或聯絡客服協助。",
        advice: "建議保持規律作息，均衡飲食，適量運動。如有不適請諮詢專業中醫師。"
      });
    }
  } catch (error: any) {
    console.error("Constitution analysis failed:", error);
    throw new Error(`體質分析失敗：${error.message || '請檢查網路連線或稍後再試'}`);
>>>>>>> upstream/main
  }
};

/**
 * Finds TCM doctors using Google Maps grounding.
 */
export const findDoctors = async (
  location: string, 
  specialty: string, 
  userLat?: number, 
  userLng?: number
): Promise<DoctorSearchResult> => {
  try {
    const prompt = `請幫我尋找位於 ${location || '附近'} 的中醫診所或中醫師，特別是專精於 ${specialty || '一般中醫'} 的醫師。請提供診所名稱、地址、評分以及簡單的評價摘要。`;
    
    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (userLat && userLng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: userLat,
            longitude: userLng
          }
        }
      };
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: config
    });

    const text = response.text || "找不到相關資訊。";
    const places: GroundingPlace[] = [];

    // Extract grounding chunks
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.web?.uri && chunk.web?.title) {
             places.push({
              title: chunk.web.title,
              uri: chunk.web.uri,
              address: chunk.web.title // Use title as fallback or if detailed address isn't clearly separated
            });
        }
      }
    }
    
    return { text, places };

  } catch (error) {
    console.error("Find doctors failed:", error);
    throw new Error("搜尋失敗，請稍後再試。");
  }
};

/**
 * Searches for TCM knowledge topics.
 */
export const searchKnowledge = async (query: string, category: string = ''): Promise<KnowledgeItem[]> => {
  try {
    const prompt = `
      作為一個中醫知識庫引擎，請針對"${query}"（類別：${category || '綜合'}）提供 6-8 個相關的專業主題或詞條。
      請以 JSON 陣列格式回傳，不要使用 Markdown code block。格式：
      [
        {
          "title": "詞條名稱",
          "summary": "簡短說明（30字內）",
          "category": "所屬類別（如中藥、方劑、穴位、養生、病症）",
          "tags": ["標籤1", "標籤2"]
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as KnowledgeItem[];
  } catch (error) {
    console.error("Knowledge search failed:", error);
    return [];
  }
};

/**
 * Generates a detailed article for a knowledge topic.
 */
export const getKnowledgeArticle = async (title: string): Promise<string> => {
  try {
    const prompt = `
      請為中醫詞條「${title}」撰寫一篇專業、結構清晰的百科全書式文章。
      請使用 Markdown 格式。
      
      文章結構建議（視主題調整）：
      1. **概述**: 定義與基本介紹。
      2. **性味歸經 / 原理**: （若是藥材或方劑）性味、歸經；（若是穴位）定位、解剖；（若是養生）理論基礎。
      3. **功效與主治**: 詳細列出功效與適應症。
      4. **現代應用 / 科學研究**: 結合現代醫學觀點或研究成果。
      5. **禁忌與注意事項**: 重要的安全資訊。
      6. **生活應用**: 如何在日常生活中應用（食療、按摩等）。
      
      語氣專業但易懂，適合一般大眾閱讀。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text || "無法生成文章內容。";
  } catch (error) {
    console.error("Get article failed:", error);
    throw new Error("文章生成失敗。");
  }
};