(() => {
 const toggle=document.getElementById('waltzToggle');
 const status=document.getElementById('musicStatus');
 const audio=document.getElementById('circoWaltz');if(!toggle||!audio||!status)return;audio.volume=.3;audio.loop=false;const startAt=45;let firstStart=true;
 audio.src='https://upload.wikimedia.org/wikipedia/commons/transcoded/e/ea/Sobre_las_olas.ogg/Sobre_las_olas.ogg.mp3';
 let pending=false;
 const words=()=>({es:{on:'Activar música: Sobre las olas',off:'Desactivar música: Sobre las olas',error:'No se ha podido reproducir la música. Pulsa para volver a intentarlo.',day:'Día',night:'Noche',auto:'Auto',next:'Cambiar ambiente'},en:{on:'Play music: Over the Waves',off:'Pause music: Over the Waves',error:'The music could not be played. Press to try again.',day:'Day',night:'Night',auto:'Auto',next:'Change appearance'},fr:{on:'Activer la musique : Sur les vagues',off:'Couper la musique : Sur les vagues',error:'La musique ne peut pas être lue. Appuyez pour réessayer.',day:'Jour',night:'Nuit',auto:'Auto',next:'Changer l’ambiance'}}[document.documentElement.lang]||{on:'Activar música',off:'Desactivar música',error:'No se ha podido reproducir la música.',day:'Día',night:'Noche',auto:'Auto',next:'Cambiar ambiente'});
 const reflect=playing=>{toggle.setAttribute('aria-pressed',String(playing));toggle.setAttribute('aria-label',playing?words().off:words().on);toggle.title=toggle.getAttribute('aria-label');};
 audio.addEventListener('playing',()=>{reflect(true);status.textContent='';});
 audio.addEventListener('pause',()=>reflect(false));
 audio.addEventListener('ended',()=>{audio.currentTime=startAt;audio.play().catch(()=>reflect(false));});
 audio.addEventListener('error',()=>{reflect(false);status.textContent=words().error;});
 toggle.addEventListener('click',async()=>{if(pending)return;if(!audio.paused){audio.pause();return;}pending=true;toggle.disabled=true;try{if(firstStart){audio.currentTime=startAt;firstStart=false;}await audio.play();}catch(e){reflect(false);status.textContent=words().error;}finally{pending=false;toggle.disabled=false;}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();});
 window.addEventListener('pagehide',()=>audio.pause());
 const root=document.documentElement,theme=document.getElementById('ambienceToggle'),label=document.getElementById('ambienceLabel');
 const system=window.matchMedia('(prefers-color-scheme: dark)');let mode='day';try{const saved=localStorage.getItem('circo-ambience');if(['day','night','auto'].includes(saved))mode=saved;}catch(_){}
 function setMode(){root.dataset.circoMode=mode;root.dataset.circoNight=String(mode==='night'||(mode==='auto'&&system.matches));label.textContent=words()[mode];const text={auto:'Ambiente automático del dispositivo. Cambiar a día',night:'Ambiente de noche. Usar ajuste del dispositivo',day:'Ambiente de día. Cambiar a noche'}[mode];theme.setAttribute('aria-label',label.textContent+'. '+words().next);theme.title=theme.getAttribute('aria-label');}
 theme.addEventListener('click',()=>{mode={day:'night',night:'auto',auto:'day'}[mode];try{localStorage.setItem('circo-ambience',mode);}catch(_){}setMode();});
 system.addEventListener('change',setMode);new MutationObserver(()=>{setMode();reflect(!audio.paused);}).observe(root,{attributes:true,attributeFilter:['lang']});setMode();reflect(false);
})();
