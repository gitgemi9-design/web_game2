
(function(){
  const STORAGE_KEY = 'adventure.save'

  const scenes = {
    start: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-smile.svg',
      speaker: '',
      text: '今日は短いお散歩のはじまり。どうする？',
      choices: [
        {text:'一緒に行く', to:'meet_intro'},
        {text:'遠慮する', to:'decline'}
      ]
    },
    meet_intro: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-smile.svg',
      speaker: '友人',
      text: '久しぶり！少し歩きながら話さない？今日はゆっくりめで大丈夫。',
      choices: [
        {text:'歩きながら話す', to:'park_chat'},
        {text:'近所のカフェへ', to:'cafe_arrive'}
      ]
    },
    park_chat: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-think.svg',
      speaker: '友人',
      text: 'この公園、落ち着くね。最近どんなことしてるの？',
      choices: [
        {text:'仕事の話をする', to:'park_work'},
        {text:'最近の趣味を話す', to:'park_hobby'}
      ]
    },
    park_work: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-think.svg',
      speaker: '',
      text: '新しいプロジェクトで忙しかったけど、学びが多かったよ。',
      choices: [ {text:'カフェに行く', to:'cafe_arrive'}, {text:'別れを告げる', to:'ending_alone'} ]
    },
    park_hobby: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-smile.svg',
      speaker: '',
      text: '最近は写真を始めたんだ。今度一緒に撮りに行こうよ。',
      choices: [ {text:'約束する', to:'ending_friendship'}, {text:'また今度', to:'ending_alone'} ]
    },
    cafe_arrive: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-think.svg',
      speaker: '店員',
      text: 'いらっしゃいませ。おすすめは本日のブレンドです。',
      choices: [
        {text:'コーヒーにする', to:'coffee_chat'},
        {text:'紅茶にする', to:'tea_chat'},
        {text:'席だけにする', to:'sit_only'}
      ]
    },
    coffee_chat: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-smile.svg',
      speaker: '友人',
      text: 'このコーヒー、意外と香りがあっていいね。最近どう？',
      choices: [
        {text:'仕事の話をする', to:'talk_work'},
        {text:'趣味の話をする', to:'talk_hobby'}
      ]
    },
    tea_chat: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-think.svg',
      speaker: '友人',
      text: '紅茶で落ち着いたね。ゆっくり話そう。',
      choices: [
        {text:'仕事の話をする', to:'talk_work'},
        {text:'趣味の話をする', to:'talk_hobby'}
      ]
    },
    sit_only: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-smile.svg',
      speaker: '友人',
      text: '今日はのんびりするだけでいいね。話もゆっくりできてよかった。',
      choices: [ {text:'タイトルに戻る', to:'start'} ]
    },
    talk_work: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-think.svg',
      speaker: '',
      text: '仕事の話題で盛り上がり、励まし合った。気持ちが軽くなった。',
      choices: [ {text:'タイトルに戻る', to:'start'} ]
    },
    talk_hobby: {
      bg: 'assets/bg-cafe.svg',
      char: 'assets/char-smile.svg',
      speaker: '',
      text: '趣味の話で意外な共通点が見つかり、今度一緒に出かける約束をした。',
      choices: [ {text:'タイトルに戻る', to:'start'} ]
    },
    decline: {
      bg: 'assets/bg-home.svg',
      char: 'assets/char-sad.svg',
      speaker: '友人',
      text: 'そうか……残念だけど、また今度ね。',
      choices: [ {text:'タイトルに戻る', to:'start'} ]
    },
    ending_friendship: {
      bg: 'assets/bg-park.svg',
      char: 'assets/char-smile.svg',
      speaker: '',
      text: '新しい約束ができて、これからが楽しみになった。良い1日だった。',
      choices: [ {text:'タイトルに戻る', to:'start'} ]
    },
    ending_alone: {
      bg: 'assets/bg-home.svg',
      char: 'assets/char-sad.svg',
      speaker: '',
      text: '今日は一人でゆっくり過ごすことにした。次はもっと元気に会おう。',
      choices: [ {text:'タイトルに戻る', to:'start'} ]
    }
  }

  let current = 'start'
  let typingTimer = null

  const $ = s => document.querySelector(s)

  function setScene(id){
    const s = scenes[id]
    if(!s) return console.warn('Unknown scene', id)
    current = id
    $('#bg').src = s.bg
    $('#char').src = s.char
    $('#speaker').textContent = s.speaker || ''
    renderText(s.text)
    renderChoices(s.choices)
  }

  function renderChoices(choices){
    const container = $('#choices')
    container.innerHTML = ''
    choices.forEach(c => {
      const btn = document.createElement('button')
      btn.className = 'choice'
      btn.textContent = c.text
      btn.addEventListener('click', ()=> setScene(c.to))
      container.appendChild(btn)
    })
  }

  function renderText(text){
    const node = $('#text')
    if(typingTimer){ clearInterval(typingTimer); typingTimer = null }
    node.textContent = ''
    let i = 0
    const speed = 18
    typingTimer = setInterval(()=>{
      node.textContent += text[i++] || ''
      if(i > text.length){ clearInterval(typingTimer); typingTimer = null }
    }, speed)
  }

  function showStartScreen(show){
    const el = $('#start-screen')
    if(show){
      el.style.display = 'flex'
      updateLoadButton()
    } else {
      el.style.display = 'none'
    }
  }

  function saveProgress(){
    const data = {scene: current, ts: Date.now()}
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      showToast('セーブしました')
    }catch(e){
      showToast('セーブに失敗しました')
    }
  }

  function loadProgress(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY)
      if(!raw) return null
      return JSON.parse(raw)
    }catch(e){ return null }
  }

  function updateLoadButton(){
    const btn = $('#btn-load')
    const data = loadProgress()
    btn.disabled = !data
    const info = $('#save-info')
    if(data) {
      const d = new Date(data.ts)
      info.textContent = `最後のセーブ: ${d.toLocaleString()}`
    } else info.textContent = 'セーブデータはありません'
  }

  function showToast(msg, ms=1600){
    const t = $('#toast')
    t.textContent = msg
    t.classList.add('show')
    setTimeout(()=> t.classList.remove('show'), ms)
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // 開始画面ボタン
    $('#btn-new').addEventListener('click', ()=>{
      showStartScreen(false)
      setScene('start')
    })
    $('#btn-load').addEventListener('click', ()=>{
      const data = loadProgress()
      if(data && data.scene){
        showStartScreen(false)
        setScene(data.scene)
        showToast('ロードしました')
      } else showToast('ロードできるデータがありません')
    })

    // キー操作: s でセーブ
    document.addEventListener('keydown', (ev)=>{
      if(ev.key === 's' || ev.key === 'S'){
        saveProgress()
      }
    })

    // 最初は開始画面を表示
    showStartScreen(true)
  })

  window.__adventure = {setScene, saveProgress, loadProgress}

})();

