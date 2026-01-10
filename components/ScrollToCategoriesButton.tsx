"use client"

const ScrollToCategoriesButton = () => {
  const scrollToBottom = () => {
    const el = document.getElementById("top-categories")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <button
      onClick={scrollToBottom}
      className="rounded-lg bg-white/20 px-3 py-2 text-sm font-bold text-white hover:bg-white/30 transition cursor-pointer" style={{padding:'1rem', fontSize:'1rem'}}
    >
      <h1>Top Categories</h1>
    </button>
  )
}

export default ScrollToCategoriesButton
