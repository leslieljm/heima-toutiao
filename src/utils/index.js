// 该函数功能：将file文件对象(二进制数据)转成base64
// 参数file：用户选择的文件对象
export function resolveToBase64(file) {
  return new Promise((resolve) => {
    const fr = new FileReader(file)
    fr.readAsDataURL(file)
    fr.onload = (e) => {
      resolve(e.target.result)
    }
  })
}
