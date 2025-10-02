// ----- Dữ liệu mẫu -----
const products = [
    {id:1,brand:'Apple',title:'iPhone 15 Pro Max 256GB',price:33990000, rating:4.8, img:'https://via.placeholder.com/400x300?text=iPhone+15+Pro'},
    {id:2,brand:'Apple',title:'iPhone 14 128GB',price:18990000, rating:4.6, img:'https://via.placeholder.com/400x300?text=iPhone+14'},
    {id:3,brand:'Samsung',title:'Samsung Galaxy S24 Ultra',price:30990000, rating:4.7, img:'https://via.placeholder.com/400x300?text=Galaxy+S24'},
    {id:4,brand:'Samsung',title:'Samsung A54 128GB',price:6490000, rating:4.2, img:'https://via.placeholder.com/400x300?text=Samsung+A54'},
    {id:5,brand:'Xiaomi',title:'Xiaomi 14 256GB',price:12990000, rating:4.3, img:'https://via.placeholder.com/400x300?text=Xiaomi+14'},
    {id:6,brand:'OPPO',title:'OPPO Find X7',price:17990000, rating:4.1, img:'https://via.placeholder.com/400x300?text=OPPO+Find+X7'},
    {id:7,brand:'realme',title:'realme GT Neo',price:6990000, rating:4.0, img:'https://via.placeholder.com/400x300?text=realme+GT+Neo'},
    {id:8,brand:'Vivo',title:'Vivo V29',price:8990000, rating:4.0, img:'https://via.placeholder.com/400x300?text=Vivo+V29'}
  ];
  
  // ----- Trạng thái -----
  let state = {
    query:'', brand:null, minPrice:null, maxPrice:null, sort:'new', cart:{}
  }
  
  // ----- Hàm tiện ích -----
  const fmt = n => n.toLocaleString('vi-VN') + ' ₫';
  
  // ----- Hiển thị danh sách thương hiệu -----
  const brandList = document.getElementById('brandList');
  const brands = Array.from(new Set(products.map(p=>p.brand)));
  brands.forEach(b=>{
    const el = document.createElement('div'); el.className='chip'; el.innerText=b;
    el.addEventListener('click',()=>{
      el.classList.toggle('active');
      state.brand = el.classList.contains('active')?b:null;
      renderProducts();
    });
    brandList.appendChild(el);
  });
  
  // ----- Hiển thị sản phẩm -----
  const productGrid = document.getElementById('productGrid');
  const resultInfo = document.getElementById('resultInfo');
  function renderProducts(){
    const q = state.query.trim().toLowerCase();
    let list = products.filter(p=>{
      if(state.brand && p.brand!==state.brand) return false;
      if(q && !(p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))) return false;
      if(state.minPrice && p.price < state.minPrice) return false;
      if(state.maxPrice && p.price > state.maxPrice) return false;
      return true;
    });
  
    if(state.sort==='price-asc') list.sort((a,b)=>a.price-b.price);
    if(state.sort==='price-desc') list.sort((a,b)=>b.price-a.price);
    if(state.sort==='popular') list.sort((a,b)=>b.rating-a.rating);
    if(state.sort==='new') list.sort((a,b)=>b.id-b.id); // demo
  
    productGrid.innerHTML='';
    resultInfo.innerText = `${list.length} sản phẩm`;
  
    list.forEach(p=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.title}" />
        <h3>${p.title}</h3>
        <div class="muted">${p.brand} · <span class="star">★ ${p.rating}</span></div>
        <div class="price-row">
          <div class="price">${fmt(p.price)}</div>
          <div class="muted">Trả góp 0%</div>
        </div>
        <div class="actions-row">
          <button class="btn btn-outline" data-id="${p.id}">Xem chi tiết</button>
          <button class="btn btn-primary" data-add="${p.id}">Thêm vào giỏ</button>
        </div>
      `;
      productGrid.appendChild(card);
    });
  
    // Gắn sự kiện cho nút chi tiết và thêm giỏ hàng
    document.querySelectorAll('[data-id]').forEach(b=>b.addEventListener('click',e=>openModal(Number(e.currentTarget.dataset.id))));
    document.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>addToCart(Number(e.currentTarget.dataset.add))));
  }
  
  // ----- Tìm kiếm & lọc -----
  document.getElementById('btnSearch').addEventListener('click',()=>{
    state.query = document.getElementById('searchInput').value; renderProducts();
  });
  document.getElementById('sortSelect').addEventListener('change',e=>{
    state.sort = e.target.value; renderProducts();
  });
  document.getElementById('applyPrice').addEventListener('click',()=>{
    const min = Number(document.getElementById('minPrice').value) || null;
    const max = Number(document.getElementById('maxPrice').value) || null;
    state.minPrice = min; state.maxPrice = max; renderProducts();
  });
  
  // ----- Modal sản phẩm -----
  const overlay = document.getElementById('overlay');
  function openModal(id){
    const p = products.find(x=>x.id===id); if(!p) return;
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalTitle').innerText = p.title;
    document.getElementById('modalBrand').innerText = p.brand;
    document.getElementById('modalPrice').innerText = fmt(p.price);
    document.getElementById('modalDesc').innerText = 'Mô tả mẫu: Màn hình, cấu hình, camera — thông số minh họa.';
    overlay.style.display = 'flex';
    document.getElementById('addToCartModal').dataset.add = id;
  }
  document.getElementById('closeModal').addEventListener('click',()=>overlay.style.display='none');
  document.getElementById('overlay').addEventListener('click',(e)=>{ if(e.target===overlay) overlay.style.display='none' });
  
  // ----- Giỏ hàng -----
  const cartCount = document.getElementById('cartCount');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartItemsEl = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  
  function saveCart(){ localStorage.setItem('cart', JSON.stringify(state.cart)); }
  function loadCart(){ const c = JSON.parse(localStorage.getItem('cart')||'{}'); state.cart = c; }
  
  function updateCartUI(){
    const items = Object.values(state.cart);
    const totalCount = items.reduce((s,i)=>s+i.qty,0);
    cartCount.innerText = totalCount;
    if(totalCount>0) cartDrawer.style.display='flex'; else cartDrawer.style.display='none';
  
    cartItemsEl.innerHTML='';
    let total = 0;
    items.forEach(ci=>{
      const div = document.createElement('div'); div.className='cart-item';
      div.innerHTML = `
        <img src="${ci.img}" />
        <div style="flex:1">
          <div style="font-weight:700">${ci.title}</div>
          <div class="muted">${fmt(ci.price)}</div>
          <div style="margin-top:6px;display:flex;gap:8px;align-items:center">
            <div class="qty">
              <button data-dec="${ci.id}">-</button>
              <div style="padding:6px 8px">${ci.qty}</div>
              <button data-inc="${ci.id}">+</button>
            </div>
            <button data-rem="${ci.id}" style="border:none;background:transparent;color:#c33;cursor:pointer">Xóa</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
      total += ci.price * ci.qty;
    });
    cartTotalEl.innerText = fmt(total);
  
    // Gắn sự kiện cho tăng/giảm số lượng
    cartItemsEl.querySelectorAll('[data-inc]').forEach(b=>b.addEventListener('click',e=>changeQty(Number(e.currentTarget.dataset.inc),1)));
    cartItemsEl.querySelectorAll('[data-dec]').forEach(b=>b.addEventListener('click',e=>changeQty(Number(e.currentTarget.dataset.dec),-1)));
    cartItemsEl.querySelectorAll('[data-rem]').forEach(b=>b.addEventListener('click',e=>removeItem(Number(e.currentTarget.dataset.rem))));
  
    saveCart();
  }
  
  function addToCart(id){
    const p = products.find(x=>x.id===id); if(!p) return;
    if(!state.cart[id]) state.cart[id] = {...p, qty:0};
    state.cart[id].qty += 1;
    updateCartUI();
  }
  
  function changeQty(id,delta){
    if(!state.cart[id]) return;
    state.cart[id].qty += delta;
    if(state.cart[id].qty <= 0) delete state.cart[id];
    updateCartUI();
  }
  function removeItem(id){ delete state.cart[id]; updateCartUI(); }
  
  // Gắn sự kiện thêm giỏ hàng từ modal
  document.getElementById('addToCartModal').addEventListener('click',e=>{
    const id = Number(e.currentTarget.dataset.add); addToCart(id); overlay.style.display='none';
  });
  
  // Lưu giỏ hàng vào localStorage
  loadCart(); updateCartUI();
  
  // Hiển thị sản phẩm ban đầu
  renderProducts();
  
  // Mở giỏ hàng khi bấm vào biểu tượng
  document.querySelector('.cart-bubble').addEventListener('click',()=>{
    if(Object.keys(state.cart).length) cartDrawer.scrollIntoView({behavior:'smooth'}); else alert('Giỏ hàng trống');
  });
  
  // Thanh toán (demo)
  document.querySelector('.checkout').addEventListener('click',()=>{
    if(!Object.keys(state.cart).length) return alert('Giỏ hàng trống');
    alert('Checkout (demo) — thực hiện gửi đơn tới backend ở đây.');
    state.cart = {}; updateCartUI();
  });
  