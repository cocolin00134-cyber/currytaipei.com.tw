(function(){
  var STORES={
    sanchong:{name:"三重雙園店",line:"@469wmrul",lastSlot:"22:00"},
    keelung:{name:"基隆新豐店",line:"@621eyvui",lastSlot:"20:30"}
  };
  function lineUrl(id,text){return "https://line.me/R/oaMessage/"+encodeURIComponent(id)+"/?"+encodeURIComponent(text);}
  function copy(text){try{if(navigator.clipboard)navigator.clipboard.writeText(text);}catch(e){}}
  function slots(start,end){var out=[],p=start.split(":"),t=+p[0]*60+ +p[1],q=end.split(":"),e=+q[0]*60+ +q[1];
    for(;t<=e;t+=30){out.push(String(Math.floor(t/60)).padStart(2,"0")+":"+String(t%60).padStart(2,"0"));}return out;}
  function fillTimes(sel,storeKey){
    var s=STORES[storeKey]||STORES.sanchong; sel.innerHTML="";
    [["午餐",slots("11:00","14:00")],["晚餐",slots("16:30",s.lastSlot)]].forEach(function(g){
      var og=document.createElement("optgroup");og.label=g[0];
      g[1].forEach(function(v){var o=document.createElement("option");o.value=o.textContent=v;og.appendChild(o);});
      sel.appendChild(og);});
  }
  function send(storeKey,text,msgEl){
    var s=STORES[storeKey]||STORES.sanchong; copy(text);
    if(msgEl){msgEl.innerHTML="已為您開啟 <b>丼品香 "+s.name+"</b> 官方 LINE，請在對話框按「傳送」即完成。若沒有自動帶入文字，內容已複製，直接貼上即可。";msgEl.classList.add("show");}
    window.location.href=lineUrl(s.line,text);
  }
  // booking
  var bf=document.getElementById("booking-form");
  if(bf){
    var st=bf.querySelector("[name=store]"),tm=bf.querySelector("[name=time]"),dt=bf.querySelector("[name=date]");
    var d=new Date();dt.min=d.toISOString().slice(0,10);
    fillTimes(tm,st.value);st.addEventListener("change",function(){fillTimes(tm,st.value);});
    bf.addEventListener("submit",function(ev){ev.preventDefault();var f=new FormData(bf);
      var text="【丼品香 線上訂位】\n門市："+STORES[f.get("store")].name+"\n姓名："+f.get("name")+"\n電話："+f.get("phone")+"\n日期："+f.get("date")+"\n時間："+f.get("time")+"\n人數："+f.get("people")+" 位"+(f.get("note")?"\n備註："+f.get("note"):"");
      send(f.get("store"),text,document.getElementById("booking-msg"));});
  }
  // shop
  var sf=document.getElementById("shop-form");
  if(sf){
    var items=[].slice.call(document.querySelectorAll("[data-product]")),totalEl=document.getElementById("shop-total");
    function total(){var t=0;items.forEach(function(it){t+=(+it.dataset.price)*(+it.querySelector("output").value);});totalEl.textContent="NT$ "+t;return t;}
    items.forEach(function(it){var o=it.querySelector("output");
      it.querySelector("[data-minus]").onclick=function(){o.value=Math.max(0,+o.value-1);total();};
      it.querySelector("[data-plus]").onclick=function(){o.value=+o.value+1;total();};});
    var pick=sf.querySelector("[name=pickup]"),addr=document.getElementById("addr-row");
    pick.addEventListener("change",function(){addr.style.display=pick.value==="delivery"?"":"none";});
    sf.addEventListener("submit",function(ev){ev.preventDefault();
      var lines=[];items.forEach(function(it){var q=+it.querySelector("output").value;if(q)lines.push("・"+it.dataset.product+" x"+q+"（NT$"+(q*it.dataset.price)+"）");});
      var m=document.getElementById("shop-msg");
      if(!lines.length){m.textContent="請先選擇商品數量。";m.classList.add("show");return;}
      var f=new FormData(sf),p=f.get("pickup"),storeKey=p==="keelung"?"keelung":"sanchong";
      var text="【丼品香 商品訂購】\n"+lines.join("\n")+"\n合計：NT$"+total()+"\n取貨方式："+(p==="delivery"?"宅配（運費另計）":STORES[p].name+" 自取")+"\n姓名："+f.get("name")+"\n電話："+f.get("phone")+(p==="delivery"?"\n地址："+f.get("address"):"")+(f.get("note")?"\n備註："+f.get("note"):"");
      send(storeKey,text,m);});
    total();
  }
  var y=document.getElementById("year");if(y)y.textContent=new Date().getFullYear();
})();
