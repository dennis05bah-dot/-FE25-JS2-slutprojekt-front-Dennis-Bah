(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=document.querySelector(`#app`),t=[],n=[];e.innerHTML=`
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
`;var r=document.querySelector(`#load`),i=document.querySelector(`#createMember`),a=document.querySelector(`#createAssignment`);async function o(){t=await(await fetch(`http://localhost:3000/assignments`)).json(),n=await(await fetch(`http://localhost:3000/members`)).json()}function s(){let e=document.querySelector(`#newList`),r=document.querySelector(`#doingList`),i=document.querySelector(`#doneList`);e.innerHTML=``,r.innerHTML=``,i.innerHTML=``,t.forEach(t=>{let a=document.createElement(`li`);a.classList.add(`card`),a.classList.add(`status-${t.status}`);let c=n.find(e=>e.id===t.assignedto);if(a.innerHTML=`
      <strong>${t.title}</strong><br/>
      ${t.description}<br/>
      ${t.category}<br/>
      ${t.timestamp}<br/>
      ${c?` `+c.name:``}
    `,t.status===`new`){let r=document.createElement(`input`);r.placeholder=`Skriv namn`;let i=document.createElement(`button`);i.textContent=`Tilldela`,i.addEventListener(`click`,async()=>{let e=n.find(e=>e.name.toLowerCase()===r.value.toLowerCase()&&e.category===t.category);if(!e){alert(`Ingen medlem med rätt kategori!`);return}await fetch(`http://localhost:3000/assignments/${t.id}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify({status:`doing`,assignedto:e.id})}),await o(),s()}),a.appendChild(r),a.appendChild(i),e.appendChild(a)}else if(t.status===`doing`){let e=document.createElement(`button`);e.textContent=`Markera klar`,e.addEventListener(`click`,async()=>{await fetch(`http://localhost:3000/assignments/${t.id}`,{method:`PATCH`,headers:{"Content-Type":`application/json`},body:JSON.stringify({status:`done`})}),await o(),s()}),a.appendChild(e),r.appendChild(a)}else if(t.status===`done`){let e=document.createElement(`button`);e.textContent=`Radera`,e.addEventListener(`click`,async()=>{await fetch(`http://localhost:3000/assignments/${t.id}`,{method:`DELETE`}),await o(),s()}),a.appendChild(e),i.appendChild(a)}})}r.addEventListener(`click`,async()=>{await o(),s()}),i.addEventListener(`click`,async()=>{let e=document.querySelector(`#memberName`),t=document.querySelector(`#memberCategory`);e.value&&(await fetch(`http://localhost:3000/members`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({name:e.value,category:t.value})}),e.value=``,await o(),s())}),a.addEventListener(`click`,async()=>{let e=document.querySelector(`#title`),t=document.querySelector(`#description`),n=document.querySelector(`#category`);!e.value||!t.value||(await fetch(`http://localhost:3000/assignments`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({title:e.value,description:t.value,category:n.value})}),e.value=``,t.value=``,await o(),s())});