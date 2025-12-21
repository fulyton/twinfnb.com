// Active navigation highlight based on current page
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop() || "index.html"
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    const href = item.getAttribute("href")
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      item.classList.add("active")
    } else {
      item.classList.remove("active")
    }
  })

  // Franchise form handling
  const franchiseForm = document.getElementById("franchiseForm")
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", handleFranchiseSubmit)
  }
})

function handleFranchiseSubmit(e) {
  e.preventDefault()

  const privacyConsent = document.getElementById("privacyConsent")
  const consentError = document.getElementById("consentError")

  // Check privacy consent
  if (!privacyConsent.checked) {
    consentError.style.display = "block"
    privacyConsent.focus()
    return false
  }

  consentError.style.display = "none"

  // Collect form data
  const formData = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
    message: document.getElementById("message").value,
    privacyConsent: true,
    submittedAt: new Date().toISOString(),
  }

  // 1. Download JSON file
  downloadJSON(formData)

  // 2. Open mailto with form data
  openMailto(formData)

  // Show success message
  const successMessage = document.getElementById("successMessage")
  successMessage.style.display = "block"
  successMessage.scrollIntoView({ behavior: "smooth" })

  // Reset form
  setTimeout(() => {
    document.getElementById("franchiseForm").reset()
    successMessage.style.display = "none"
  }, 5000)

  return false
}

function downloadJSON(data) {
  const now = new Date()
  const timestamp = formatDateTime(now)
  const filename = `franchise-request-${timestamp}.json`

  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: "application/json" })
  const url = URL.createObjectURL(blob)

  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function openMailto(data) {
  const subject = encodeURIComponent(`[Franchise Request] ${data.name} - ${data.phone}`)

  const body = `
프랜차이즈 신청 정보

이름: ${data.name}
연락처: ${data.phone}
이메일: ${data.email}
연락주소: ${data.address}
문의내용: ${data.message || "(없음)"}

개인정보 동의: 동의함
신청일시: ${data.submittedAt}
    `.trim()

  const mailtoLink = `mailto:info@twinfnb.com?subject=${subject}&body=${encodeURIComponent(body)}`
  window.location.href = mailtoLink
}

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")

  return `${year}${month}${day}-${hours}${minutes}${seconds}`
}
