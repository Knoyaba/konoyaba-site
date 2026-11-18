/* Public, route-specific copy. Never infer appearance or relationships from another route. */
window.KONOYABA_CHARACTER_ROUTES = {
  yato: {
    label: '夜斗版', subtitle: '黒瀬夜斗の物語',
    readUrl: 'https://ncode.syosetu.com/n8434mr/',
    introduction: '黒瀬夜斗と、召喚や現地での出会いを通じて関わる人物たち。',
    note: '召喚される人物の来歴は共通。召喚後の成長や関係性は版ごとに異なります。このページの紹介は夜斗版を対象にしています。'
  },
  asato: {
    label: '朝斗版', subtitle: 'リミットブレイク版',
    readUrl: 'https://ncode.syosetu.com/n6073ms/',
    introduction: 'ガチャを回し、領域を育て、王国を広げる。白瀬朝斗と、それぞれの意思を持つ人々の物語。',
    note: '朝斗版はリミットブレイク版です。共通する人物の来歴を土台に、成長や関係性は朝斗版の物語に沿って紹介します。紹介内容は公開済み第1〜12話を基準にしています。',
    profiles: [
      {id:'asato',name:'白瀬朝斗',reading:'ASATO',type:'main',badge:'王',color:'#d6af62',art:'../images/characters/20261118-canon/asato.webp',title:'《淫獄》の成長にのめり込む大学生',description:'手に入れたキャラクターは限界まで育てたい、と考える成人大学生。領域を広げ、新たな住民を呼ぶことに強く惹かれ、召喚への衝動にも合理的な理由を見つけていく。誰かを助けたい気持ちは本物だが、自分の望みと相手の意思が重なるとは限らない。'},
      {baseId:'faste',description:'以前の雇用先から逃げ出した、現地人の家政婦。朝斗が《淫獄》へ迎えた最初の住民。家事や食事、茶を淹れる経験を持ち、暮らしの小さな不安や、新しく呼ばれる相手への説明にも目を向ける。'},
      {id:'aquaria',name:'アクアリア・メルシェ',reading:'AQUARIA',type:'summoned',badge:'SSR',color:'#a6cce0',art:'../images/characters/20261118-details/aquaria.webp',title:'枯れた聖泉の守り人',description:'水を生み、操り、浄化する力を持つ水精族。傷の手当や護身にも長ける。突然の召喚に警戒しながらも、目の前の怪我や飲み水の問題に向き合う。ひび割れた青い雫形の石を大切にしている。'},
      {id:'mira',name:'ミラ・コレット',reading:'MIRA',type:'summoned',badge:'R',color:'#d1b08d',art:'../images/characters/20261118-canon/mira.webp',title:'飢えた宿の料理番',description:'宿の厨房で働いていた、経験豊かな料理人。食材の状態や水と火の条件を見極め、限られた道具から食事を作る。食べられるものを無駄にせず、無理をする相手には率直に声をかける現実派。'},
      {id:'lydia',name:'リディア・ハウゼン',reading:'LYDIA',type:'summoned',badge:'SR',color:'#c4bc9a',art:'../images/characters/20261118-details/lydia.webp',title:'焼け落ちた工房の設計士',description:'焦げた図面筒を携えて現れた設計士。火、水、寝床、人の動線から、安全で使いやすい空間を考える。朝斗の漠然とした願いを、具体的な間取りや配置へと落とし込む。'},
      {id:'celia',name:'セリア・ノクス',reading:'CELIA',type:'summoned',badge:'SR',color:'#a9b6a4',art:'../images/characters/20261118-canon/celia.webp',title:'帰る隊を失った斥候',description:'短弓と短剣を携えた斥候。地形や痕跡を自分の目で確かめ、危険と退路を見定める。朝斗の期待や思い込みへも率直に異を唱える。召喚される直前まで、隊の仲間を探していた。'},
      {id:'erne',name:'エルネ・ヴァルト',reading:'ERNE',type:'summoned',badge:'SSR',color:'#a5bd91',art:'../images/characters/20261118-canon/erne.webp',title:'塩害の村を実らせた農術師',description:'土と水、光、育つまでの時間を見極める農術師。村へ届ける種を抱えて召喚された。何もない場所から食料を生み出すのではなく、環境を整え、続けられる畑を作ることを大切にする。'},
      {id:'leona',name:'レオナ・グラーデ',reading:'LEONA',type:'summoned',badge:'SSR',color:'#c09e92',art:'../images/characters/20261118-canon/leona.webp',title:'潰えた隊商の道守',description:'大盾と長槍を携え、隊商の行路と人を守ってきた護衛。道や地形だけでなく、通行や交渉の条件にも目を向ける。守るべき相手を残したまま召喚され、帰る道を求めている。'}
    ]
  }
};


// Square crop in the original 832 x 1216 portrait, shared across routes.
window.KONOYABA_PORTRAIT_CROPS = {
  "yato": {
    "x": 260,
    "y": 0,
    "size": 320
  },
  "faste": {
    "x": 255,
    "y": 0,
    "size": 330
  },
  "lise": {
    "x": 255,
    "y": 0,
    "size": 330
  },
  "reina": {
    "x": 255,
    "y": 0,
    "size": 340
  },
  "chiyo": {
    "x": 245,
    "y": 0,
    "size": 360
  },
  "viola": {
    "x": 225,
    "y": 0,
    "size": 390
  },
  "serina": {
    "x": 250,
    "y": 0,
    "size": 340
  },
  "asato": {
    "x": 200,
    "y": 0,
    "size": 360
  },
  "celia": {
    "x": 250,
    "y": 0,
    "size": 330
  },
  "lydia": {
    "x": 255,
    "y": 0,
    "size": 330
  },
  "erne": {
    "x": 250,
    "y": 0,
    "size": 340
  },
  "leona": {
    "x": 255,
    "y": 0,
    "size": 340
  },
  "enishi": {
    "x": 25,
    "y": -60,
    "size": 720
  },
  "mira": {
    "x": 250,
    "y": 0,
    "size": 340
  },
  "nava": {
    "x": 230,
    "y": 0,
    "size": 380
  },
  "aquaria": {
    "x": 260,
    "y": 20,
    "size": 350
  }
};
