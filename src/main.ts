import "./style.css"


// typar för data från backend
type Assignment = {
  id: string
  title: string
  description: string
  category: string
  status: string
  assignedto: string | null
  timestamp: string
}

type Member = {
  id: string
  name: string
  category: string
}

const app = document.querySelector<HTMLDivElement>("#app")!

// Sparar all data från backend i dessa variabler
let assignments: Assignment[] = []
let members: Member[] = []



















// HTML på sidan
app.innerHTML = `
  <h1>Scrum Board</h1>

  <button id="load">Ladda uppgifter</button>

  <h2>Lägg till medlem</h2>
  <input id="memberName" placeholder="Namn" />
  <select id="memberCategory">
    <option value="coach">Coach</option>
    <option value="player">Player</option>
    <option value="physio">Physio</option>
  </select>
  <button id="createMember">Skapa medlem</button>

  <h2>Lägg till uppgift</h2>
  <input id="title" placeholder="Titel" />
  <input id="description" placeholder="Beskrivning" />
  <select id="category">
    <option value="coach">Coach</option>
    <option value="player">Player</option>
    <option value="physio">Physio</option>
  </select>
  <button id="createAssignment">Skapa uppgift</button>

  <div class="board">
    <div class="column">
      <h2>New</h2>
      <ul id="newList"></ul>
    </div>

    <div class="column">
      <h2>Doing</h2>
      <ul id="doingList"></ul>
    </div>

    <div class="column">
      <h2>Done</h2>
      <ul id="doneList"></ul>
    </div>
  </div>
`

// Hämta knappar
const loadBtn = document.querySelector<HTMLButtonElement>("#load")!
const createMemberBtn = document.querySelector<HTMLButtonElement>("#createMember")!
const createAssignmentBtn = document.querySelector<HTMLButtonElement>("#createAssignment")!

// ======================
// HÄMTA DATA FRÅN BACKEND
// ======================

async function loadData() {
  const aRes = await fetch("http://localhost:3000/assignments")
  assignments = await aRes.json()

  // Hämta alla medlemmar (för att kunna visa namn istället för id, och för att kunna tilldela uppgifter)
  const mRes = await fetch("http://localhost:3000/members")
  members = await mRes.json()
}

// ======================
// RITA UT ALLT PÅ SIDAN
// ======================

function render() {

  const newList = document.querySelector<HTMLUListElement>("#newList")!
  const doingList = document.querySelector<HTMLUListElement>("#doingList")!
  const doneList = document.querySelector<HTMLUListElement>("#doneList")!

  // Töm listorna innan vi ritar om
  newList.innerHTML = ""
  doingList.innerHTML = ""
  doneList.innerHTML = ""

  assignments.forEach(assignment => {

    const li = document.createElement("li")
    li.classList.add("card")
    li.classList.add(`status-${assignment.status}`)

    // Hitta namnet på medlemmen (om den finns)
    const assignedMember = members.find(m => m.id === assignment.assignedto)

    li.innerHTML = `
      <strong>${assignment.title}</strong><br/>
      ${assignment.description}<br/>
      ${assignment.category}<br/>
      ${assignment.timestamp}<br/>
      ${assignedMember ? " " + assignedMember.name : ""}
    `

    // ===== NEW =====
    if (assignment.status === "new") {

      const input = document.createElement("input")
      input.placeholder = "Skriv namn"

      const assignBtn = document.createElement("button")
      assignBtn.textContent = "Tilldela"

      assignBtn.addEventListener("click", async () => {

    
    
    
    
        // Hitta medlem med rätt namn OCH rätt kategori (för att undvika att tilldela en coach-uppgift till en spelare t.ex.)
        const member = members.find( 
          m =>
            m.name.toLowerCase() === input.value.toLowerCase() &&
            m.category === assignment.category
        )  // här jämför vi både namn och kategori för att hitta rätt medlem. och att medlemmen har rätt kategori för uppgiften (coach, player eller physio)

        // Om ingen medlem hittas, visa alert och returnera.
        if (!member) {
          alert("Ingen medlem med rätt kategori!")
          return
        }  // om member är undefined (dvs ingen medlem hittades som matchar namnet och kategorin), visa en alert och avbryt funktionen.

      
      
      
      





        // Uppdatera status till doing
        await fetch(`http://localhost:3000/assignments/${assignment.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "doing",
            assignedto: member.id
          })
        })

        await loadData()
        render()
      })

      li.appendChild(input)
      li.appendChild(assignBtn)
      newList.appendChild(li)
    }

    // ===== DOING =====
    else if (assignment.status === "doing") {

      const doneBtn = document.createElement("button")
      doneBtn.textContent = "Markera klar"

      doneBtn.addEventListener("click", async () => {

        await fetch(`http://localhost:3000/assignments/${assignment.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "done" })
        })

        await loadData()
        render()
      })

      li.appendChild(doneBtn)
      doingList.appendChild(li)
    }

    // ===== DONE =====
    else if (assignment.status === "done") {

      const deleteBtn = document.createElement("button")
      deleteBtn.textContent = "Radera"

      deleteBtn.addEventListener("click", async () => {

        await fetch(`http://localhost:3000/assignments/${assignment.id}`, {
          method: "DELETE"
        })

        await loadData()
        render()
      })

      li.appendChild(deleteBtn)
      doneList.appendChild(li)
    }

  })
}

// ======================
// KNAPPAR
// ======================

// Ladda allt
loadBtn.addEventListener("click", async () => {
  await loadData()
  render()
})

// Skapa medlem
createMemberBtn.addEventListener("click", async () => {

  const nameInput = document.querySelector<HTMLInputElement>("#memberName")!
  const categorySelect = document.querySelector<HTMLSelectElement>("#memberCategory")!

  if (!nameInput.value) return

  await fetch("http://localhost:3000/members", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: nameInput.value,
      category: categorySelect.value
    })
  })

  nameInput.value = ""

  await loadData()
  render()
})

// Skapa uppgift
createAssignmentBtn.addEventListener("click", async () => {

  const titleInput = document.querySelector<HTMLInputElement>("#title")!
  const descriptionInput = document.querySelector<HTMLInputElement>("#description")!
  const categorySelect = document.querySelector<HTMLSelectElement>("#category")!

  if (!titleInput.value || !descriptionInput.value) return

  await fetch("http://localhost:3000/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: titleInput.value,
      description: descriptionInput.value,
      category: categorySelect.value
    })
  })

  titleInput.value = ""
  descriptionInput.value = ""

  await loadData()
  render()
})