export const getShortenedMessage = (message, maxWidth) => {
  // 创建一个隐藏的 div 元素
  const hiddenDiv = document.createElement("div");
  hiddenDiv.style.visibility = "hidden";
  hiddenDiv.style.position = "absolute";
  hiddenDiv.style.top = "-9999px";
  hiddenDiv.style.width = "auto";
  hiddenDiv.style.whiteSpace = "nowrap";
  hiddenDiv.textContent = message;

  // 将隐藏的 div 添加到页面上以获取其宽度
  document.body.appendChild(hiddenDiv);
  const messageWidth = hiddenDiv.offsetWidth;

  // 根据消息宽度和最大宽度来决定是否截断消息内容
  if (messageWidth > maxWidth) {
    // 使用二分法截断消息内容
    let start = 0;
    let end = message.length - 1;
    let result = "";
    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      hiddenDiv.textContent = message.substring(0, mid + 1);
      if (hiddenDiv.offsetWidth <= maxWidth) {
        result = message.substring(0, mid + 1);
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }
    document.body.removeChild(hiddenDiv); // 移除隐藏的 div 元素
    return result + "...";
  } else {
    document.body.removeChild(hiddenDiv); // 移除隐藏的 div 元素
    return message;
  }
};
