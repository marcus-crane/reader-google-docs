(function () {
  let menuHighlightClass = "goog-menuitem-highlight"
  let userToken = ""
  document.onreadystatechange = function() {
    if (document.readyState === "complete") {
      document.querySelectorAll("script").forEach(function(node) {
        if (node.innerText.includes("_docs_flag_initialData")) {
          userToken = node.innerText.match(/.*"token":"(.*)",/)[1].replace(/:.*/, "")
        }
      })
      document.querySelector("div[id=':6e']").parentElement.insertAdjacentHTML("afterBegin", '<div class="goog-menuitem apps-menuitem" role="menuitem"><div id="readwise-button" class="goog-menuitem-content" style="user-select: none;"><span aria-label="Share s" class="goog-menuitem-label" style="user-select: none;"><span class="goog-menuitem-mnemonic-hint" style="user-select: none;">Send to Readwise Reader</div></div>')
      const readwiseButton = document.getElementById("readwise-button").parentElement
      readwiseButton.addEventListener("click", uploadToReadwise)
      readwiseButton.addEventListener("mouseover", function() {
        readwiseButton.classList.add(menuHighlightClass)
      })
      readwiseButton.addEventListener("mouseout", function() {
        readwiseButton.classList.remove(menuHighlightClass)
      })
      console.log('ready')
    }
  }

  function retrieveHTML() {
    const documentId = window.location.pathname.match(/.*\/d\/(.*)\/.*/)[1]
    return fetch(`https://docs.google.com/document/u/0/export?format=html&id=${documentId}&token=${userToken}`)
      .then(res => res.text())
      .catch(err => console.error(err))
  }

  function uploadToReadwise() {
    retrieveHTML()
      .then(googleDoc => {
        fetch("https://readwise.io/reader/api/add", {
          method: "POST",
          headers: {
            "Authorization": "Token <token>",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "category": "article",
            "children": [],
            "html": googleDoc,
            "source": "marcus@utf9k.net",
            "title": document.title,
            "triage_status": "new",
            "url": window.location.href
          })
        })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err))
      })
  }
})()
