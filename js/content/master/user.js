function singkron_user_lokal(){
    jQuery('#wrap-loading').show();
    var url = config.service_url+'auth/strict/user-manager';
    relayAjaxApiKey({
		url: url,
		type: 'get',
		success: function(user_all){            
            console.log(user_all);
			pesan_loading('Simpan data Master User ke DB Lokal!');	
            var data = { 
                action: 'singkron_user_penatausahaan',
                type: 'ri',
                tahun_anggaran: _token.tahun,
                api_key: config.api_key,
                data_user: {}
            };
            user_all.map(function(b, i){
                data.data_user[i] = {}
                data.data_user[i].idUser = b.id_user;
                data.data_user[i].idDaerah = b.id_daerah;
                data.data_user[i].userName = b.nip_user;
                data.data_user[i].fullName = b.nama_user;
                data.data_user[i].nip = b.nip_user;
                data.data_user[i].idSkpd = config.id_skpd;
                data.data_user[i].pangkatGolongan = b.id_pang_gol;
                data.data_user[i].nik = b.nik_user;
                data.data_user[i].npwp = b.npwp_user;
                data.data_user[i].alamat = b.alamat;
                data.data_user[i].lahir_user = b.lahir_user;
			});
            var data = {
                message:{
                    type: "get-url",
                    content: {
                        url: config.url_server_lokal,
                        type: 'post',
                        data: data,
                        return: false
                    }
                }
            };
            chrome.runtime.sendMessage(data, function(response) {
                console.log('responeMessage', response);
                // resolve_reduce(data_user);
                alert('Berhasil singkron User ke lokal!');
				jQuery('#wrap-loading').hide();
            });
        }
    });
}
        