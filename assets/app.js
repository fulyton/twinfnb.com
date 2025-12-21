// Language Switcher Functionality
document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-btn")

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetLang = button.getAttribute("data-lang")
      const currentPath = window.location.pathname

      // Extract the current page file name
      const pathParts = currentPath.split("/")
      const currentFile = pathParts[pathParts.length - 1] || "index.html"

      // Replace language in path
      let newPath
      if (currentPath.includes("/kr/")) {
        newPath = currentPath.replace("/kr/", `/${targetLang}/`)
      } else if (currentPath.includes("/en/")) {
        newPath = currentPath.replace("/en/", `/${targetLang}/`)
      } else if (currentPath.includes("/cn/")) {
        newPath = currentPath.replace("/cn/", `/${targetLang}/`)
      } else {
        // If no language folder detected, navigate to target language
        newPath = `/${targetLang}/${currentFile}`
      }

      window.location.href = newPath
    })
  })

  // Franchise Form Submission
  const franchiseForm = document.getElementById("franchiseForm")
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = {
        name: document.getElementById("name").value,
        phone: document.getElementById("phone").value,
        email: document.getElementById("email").value,
        address: document.getElementById("address").value,
        message: document.getElementById("message").value,
        privacyConsent: document.getElementById("privacyConsent").checked,
        submittedAt: new Date().toISOString(),
      }

      // Check privacy consent
      if (!formData.privacyConsent) {
        showMessage("error", getErrorMessage())
        return
      }

      // Create JSON file download
      const dataStr = JSON.stringify(formData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `franchise-application-${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)

      // Open mailto link
      const subject = encodeURIComponent("TwinFNB Franchise Application")
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
          `Phone: ${formData.phone}\n` +
          `Email: ${formData.email}\n` +
          `Address: ${formData.address}\n` +
          `Message: ${formData.message}\n\n` +
          `Privacy Consent: Yes\n` +
          `Submitted At: ${formData.submittedAt}`,
      )
      window.location.href = `mailto:info@twinfnb.com?subject=${subject}&body=${body}`

      // Show success message
      showMessage("success", getSuccessMessage())

      // Reset form
      franchiseForm.reset()
    })
  }

  function showMessage(type, message) {
    const messageDiv = document.getElementById("formMessage")
    messageDiv.className = `form-message ${type}`
    messageDiv.textContent = message
    messageDiv.style.display = "block"

    setTimeout(() => {
      messageDiv.style.display = "none"
    }, 5000)
  }

  function getErrorMessage() {
    const lang = getCurrentLanguage()
    const messages = {
      kr: "개인정보 수집·이용에 동의해주세요.",
      en: "Please agree to the collection and use of personal information.",
      cn: "请同意个人信息的收集与使用。",
    }
    return messages[lang] || messages.kr
  }

  function getSuccessMessage() {
    const lang = getCurrentLanguage()
    const messages = {
      kr: "신청이 완료되었습니다. 곧 연락드리겠습니다.",
      en: "Application submitted successfully. We will contact you soon.",
      cn: "申请已提交成功。我们会尽快与您联系。",
    }
    return messages[lang] || messages.kr
  }

  function getCurrentLanguage() {
    const path = window.location.pathname
    if (path.includes("/kr/")) return "kr"
    if (path.includes("/en/")) return "en"
    if (path.includes("/cn/")) return "cn"
    return "kr"
  }
})
