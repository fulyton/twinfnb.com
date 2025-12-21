// Language Switcher Functionality
document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-btn")

  langButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetLang = this.getAttribute("data-lang")
      switchLanguage(targetLang)
    })
  })
})

function switchLanguage(targetLang) {
  const currentPath = window.location.pathname

  // Extract the current page filename
  const pathParts = currentPath.split("/")
  const currentPage = pathParts[pathParts.length - 1] || "index.html"

  // Determine the new path
  let newPath

  if (currentPath.includes("/kr/")) {
    newPath = currentPath.replace("/kr/", `/${targetLang}/`)
  } else if (currentPath.includes("/en/")) {
    newPath = currentPath.replace("/en/", `/${targetLang}/`)
  } else if (currentPath.includes("/cn/")) {
    newPath = currentPath.replace("/cn/", `/${targetLang}/`)
  } else {
    // If no language folder detected, navigate to the target language
    newPath = `/${targetLang}/${currentPage}`
  }

  window.location.href = newPath
}

// Franchise Form Handling
const franchiseForm = document.getElementById("franchiseForm")
if (franchiseForm) {
  franchiseForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const formAlert = document.getElementById("formAlert")
    const privacyConsent = document.getElementById("privacyConsent")

    // Check privacy consent
    if (!privacyConsent.checked) {
      formAlert.className = "form-alert error"

      // Get the current language
      const currentPath = window.location.pathname
      let alertMessage = "You must agree to the privacy policy."

      if (currentPath.includes("/kr/")) {
        alertMessage = "개인정보 수집·이용에 동의해주세요."
      } else if (currentPath.includes("/cn/")) {
        alertMessage = "请同意个人信息收集与使用政策。"
      }

      formAlert.textContent = alertMessage
      return
    }

    // Collect form data
    const formData = {
      name: document.getElementById("name").value,
      phone: document.getElementById("phone").value,
      email: document.getElementById("email").value,
      address: document.getElementById("address").value,
      message: document.getElementById("message").value,
      privacyConsent: true,
      timestamp: new Date().toISOString(),
    }

    // Create JSON file and download
    const jsonString = JSON.stringify(formData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `franchise-application-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Open email client
    const subject = encodeURIComponent("Franchise Application - TwinFNB")
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
        `Phone: ${formData.phone}\n` +
        `Email: ${formData.email}\n` +
        `Address: ${formData.address}\n` +
        `Message: ${formData.message}\n\n` +
        `Privacy Consent: Agreed\n` +
        `Timestamp: ${formData.timestamp}`,
    )
    window.location.href = `mailto:info@twinfnb.com?subject=${subject}&body=${body}`

    // Show success message
    formAlert.className = "form-alert success"

    const currentPath = window.location.pathname
    let successMessage = "Form submitted successfully! JSON file downloaded and email client opened."

    if (currentPath.includes("/kr/")) {
      successMessage = "제출이 완료되었습니다! JSON 파일이 다운로드되고 이메일 클라이언트가 열렸습니다."
    } else if (currentPath.includes("/cn/")) {
      successMessage = "提交成功！JSON文件已下载，邮件客户端已打开。"
    }

    formAlert.textContent = successMessage

    // Reset form
    setTimeout(() => {
      franchiseForm.reset()
      formAlert.style.display = "none"
    }, 5000)
  })
}
