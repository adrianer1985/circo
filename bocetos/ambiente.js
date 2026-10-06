(() => {
 const toggle=document.getElementById('waltzToggle');
 const status=document.getElementById('musicStatus');
 const audio=document.getElementById('circoWaltz');audio.volume=.3;
 audio.src='https://upload.wikimedia.org/wikipedia/commons/transcoded/e/ea/Sobre_las_olas.ogg/Sobre_las_olas.ogg.mp3';
 let pending=false;
 const reflect=playing=>{toggle.setAttribute('aria-pressed',String(playing));toggle.setAttribute('aria-label',playing?'Desactivar música: Sobre las olas':'Activar música: Sobre las olas');toggle.title=toggle.getAttribute('aria-label');};
 audio.addEventListener('playing',()=>{reflect(true);status.textContent='';});
 audio.addEventListener('pause',()=>reflect(false));
 audio.addEventListener('error',()=>{reflect(false);status.textContent='No se ha podido cargar la música. Pulsa el botón para volver a intentarlo.';});
 toggle.addEventListener('click',async()=>{if(pending)return;if(!audio.paused){audio.pause();return;}pending=true;toggle.disabled=true;try{await audio.play();}catch(e){reflect(false);status.textContent='No se ha podido reproducir la música. Vuelve a pulsar el botón.';}finally{pending=false;toggle.disabled=false;}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();});
 window.addEventListener('pagehide',()=>audio.pause());
 const root=document.documentElement,theme=document.getElementById('ambienceToggle'),label=document.getElementById('ambienceLabel');
 const system=window.matchMedia('(prefers-color-scheme: dark)');let mode='day';
 function setMode(){root.dataset.circoMode=mode;root.dataset.circoNight=String(mode==='night'||(mode==='auto'&&system.matches));label.textContent={auto:'Auto',night:'Noche',day:'Día'}[mode];const text={auto:'Ambiente automático del dispositivo. Cambiar a día',night:'Ambiente de noche. Usar ajuste del dispositivo',day:'Ambiente de día. Cambiar a noche'}[mode];theme.setAttribute('aria-label',text);theme.title=text;}
 theme.addEventListener('click',()=>{mode={day:'night',night:'auto',auto:'day'}[mode];setMode();});
 system.addEventListener('change',setMode);setMode();
})();
