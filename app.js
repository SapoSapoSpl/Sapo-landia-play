function goGame(id){if(!localStorage.getItem('spl_user')){alert('Faça cadastro ou entre para acessar os jogos.');location.href='account.html?next='+id;return}location.href='games/'+id+'.html'}
