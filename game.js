(() => {
  const scenes = {
    start: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-smile.svg',
      speaker: '友人',
      text: 'やあ、久しぶり！今日は一緒に街を散歩しない？',
      choices: [
        {text: '行く', to: 'scene2'},
        {text: 'やめとく', to: 'end_bored'}
      ]
    },
    scene2: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-think.svg',
      speaker: '友人',
      text: 'カフェに寄っていこうか。何を飲む？',
      choices: [
        {text: 'コーヒー', to: 'end_coffee'},
        {text: '紅茶', to: 'end_tea'}
      ]
    },
    end_bored: {
      bg: 'assets/bg-home.svg',
      char: 'assets/char-sad.svg',
      speaker: '',
      text: '今日はやめておくのね……また今度ね。',
      choices: [ {text: 'タイトルに戻る', to: 'start'} ]
    },
    end_coffee: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-smile.svg',
      speaker: '',
      text: '美味しいコーヒーで会話が弾んだ。良い午後だったね。',
      choices: [ {text: 'タイトルに戻る', to: 'start'} ]
    },
    end_tea: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-think.svg',
      speaker: '',
      text: '紅茶で落ち着いた午後。ゆったりした時間が流れた。',
      choices: [ {text: 'タイトルに戻る', to: 'start'} ]
    }
  }

  let current = 'start'

  const $ = sel => document.querySelector(sel)

  function setScene(id){
    const s = scenes[id]
    if(!s) return console.warn('Unknown scene', id)
    current = id
    $('#bg').setAttribute('src', s.bg)
    $('#char').setAttribute('src', s.char)
    $('#speaker').textContent = s.speaker
    $('#text').textContent = ''
    typeText(s.text, $('#text'))
    renderChoices(s.choices)
  }

  function renderChoices(choices){
    const container = $('#choices')
    container.innerHTML = ''
    choices.forEach(c => {
      const btn = document.createElement('button')
      btn.className = 'choice'
      btn.textContent = c.text
      btn.onclick = () => setScene(c.to)
      container.appendChild(btn)
    })
  }

  function typeText(full, node){
    let i = 0
    const speed = 24
    node.textContent = ''
    const iv = setInterval(()=>{
      node.textContent += full[i++]
      if(i >= full.length) clearInterval(iv)
    }, speed)
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    setScene(current)
  })

  window.__adventure = {setScene}

})();
