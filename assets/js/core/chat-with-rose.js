document.addEventListener("DOMContentLoaded", () => {
  const chatResponse = document.getElementById("chat-response");
  const userQuestion = document.getElementById("user-question");
  const sendBtn = document.getElementById("send-btn");

  async function sendQuestion() {
    const question = userQuestion.value.trim();
    if (!question) return;

    chatResponse.textContent = "Pensando...";
    userQuestion.value = "";

    try {
      const response = await fetch("../api/ai.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();
      chatResponse.textContent = "";
      chatResponse.appendChild(
        document.createTextNode(data.answer || "Sin respuesta 😕")
      );
      if (data.link) {
        chatResponse.appendChild(document.createTextNode(" "));
        const a = document.createElement("a");
        a.href = data.link.url;
        a.textContent = data.link.text;
        chatResponse.appendChild(a);
      }
    } catch (error) {
      console.error("Error:", error);
      chatResponse.textContent = "Ha ocurrido un error al obtener la respuesta.";
    }
  }

  sendBtn.addEventListener("click", sendQuestion);

  userQuestion.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  });
});