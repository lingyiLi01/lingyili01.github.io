let hls = null;
function playHD(w){
 const status=document.getElementById('playback-status');
 status.textContent='';
 if(hls){hls.destroy();hls=null;}
 const play=()=>video.play().catch(()=>{});
 if(video.canPlayType('application/vnd.apple.mpegurl')){
  video.src=w.hd;play();
 }else if(window.Hls && Hls.isSupported()){
  hls=new Hls({maxBufferLength:20,backBufferLength:30});
  hls.loadSource(w.hd);hls.attachMedia(video);
  hls.on(Hls.Events.MANIFEST_PARSED,play);
  hls.on(Hls.Events.ERROR,(_,data)=>{
   if(data.fatal)status.textContent=language==='en'?'Video could not load. Please close and try again.':'视频暂时无法加载，请关闭后重试。';
  });
 }else{
  status.textContent=language==='en'?'Please use an up-to-date browser to play this video.':'请使用新版浏览器播放此视频。';
 }
}
let language = 'en';
let category = 'All';
const grid = document.getElementById('grid');
const dialog = document.getElementById('player');
const video = dialog.querySelector('video');
const order = [10,5,12,13,14,15,4,8,9,6,3,7,11,0,1,2];
const labels = {'On camera':'个人出镜','Social content':'账号内容','AI filmmaking':'AI 短片'};
function render(){
 grid.replaceChildren();
 for(const id of order){
  const w=WORKS.find(item=>item.id===id); if(category!=='All'&&w.category!==category)continue;
  const card=document.createElement('article'); card.className='work-card';
  const button=document.createElement('button'); button.setAttribute('aria-label',(language==='en'?'Play ':'播放 ')+(language==='en'?w.en:w.zh));
  const img=document.createElement('img');img.src=w.poster;img.alt=language==='en'?w.en:w.zh;img.loading='lazy';img.width=w.width;img.height=w.height;if(w.portrait)img.classList.add('portrait-cover');button.append(img);
  const play=document.createElement('span');play.className='play';play.textContent='▶';play.setAttribute('aria-hidden','true');button.append(play);
  const duration=document.createElement('span');duration.className='duration';duration.textContent=w.duration;button.append(duration);
  button.addEventListener('click',()=>{video.poster=w.poster;document.getElementById('video-title').textContent=language==='en'?w.en:w.zh;document.getElementById('video-role').textContent=language==='en'?w.role:w.rzh;document.getElementById('video-description').textContent=language==='en'?w.desc:w.dzh;dialog.showModal();playHD(w);});
  card.append(button);
  if(w.metric){const metric=document.createElement('p');metric.className='metric';metric.textContent=language==='en'?w.metric:w.mzh;card.append(metric);}
  for(const [tag,cls,value] of [['p','category',language==='en'?w.category:labels[w.category]],['h3','',language==='en'?w.en:w.zh],['p','role',language==='en'?w.role:w.rzh],['p','description',language==='en'?w.desc:w.dzh]]){const e=document.createElement(tag);e.className=cls;e.textContent=value;card.append(e);}
  grid.append(card);
 }
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});render();}));
document.getElementById('language').addEventListener('click',()=>{language=language==='en'?'zh':'en';document.documentElement.lang=language==='en'?'en':'zh-CN';document.querySelectorAll('[data-en]').forEach(x=>x.textContent=x.dataset[language]);const b=document.getElementById('language');b.textContent=language==='en'?'中文':'EN';b.setAttribute('aria-label',language==='en'?'Switch to Chinese':'切换为英文');render();});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{video.pause();if(hls){hls.destroy();hls=null;}video.removeAttribute('src');video.load();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();
