function singkron_npd_lokal_bpp() {
	jQuery('#wrap-loading').show();
    // var status = val;
    // var type_data = data.shift();
    new Promise(function(resolve, reject){
        // if(typeof type_data == 'undefined'){
        //     return resolve();
        // }
        singkron_npd_lokal_per_skpd(1, [], function(response){
    		var page_skpd = {};
            var last = response.length-1;
            response.reduce(function (sequence, nextData) {
                return sequence.then(function (current_data) {
                    return new Promise(function (resolve_reduce, reject_reduce) {
                        pesan_loading('Get NPD dari ID SKPD "'+current_data.id_skpd+'"');
                        if(!page_skpd[current_data.id_skpd]){
                            page_skpd[current_data.id_skpd] = [];
                        }
                        page_skpd[current_data.id_skpd].push(current_data);

                        // melakukan reset page sesuai data per skpd
                        current_data.page = page_skpd[current_data.id_skpd].length;

    					singkron_npd_ke_lokal_skpd(current_data, ()=>{
                            resolve_reduce(nextData);
      		            });
    				})
    				.catch(function(e){
    					console.log(e);
    					return Promise.resolve(nextData);
    				});
    			})
    			.catch(function(e){
    				console.log(e);
    				return Promise.resolve(nextData);
    			});
    		}, Promise.resolve(response[last]))
    		.then(function (data_last) {
    		    return singkron_npd_lokal_bpp();
    		});
        });
    })
    .then(function () {
        jQuery("#wrap-loading").hide();
        alert("Berhasil singkron NPD");
    });
}

function singkron_npd_lokal_per_skpd(page=1, response_all=[], cb){
    pesan_loading('Get data NPD halaman='+page);
    relayAjaxApiKey({
        //https://service.sipd.kemendagri.go.id/pengeluaran/strict/npd/index?page=1&limit=5&nomor=&tanggal_mulai=&tanggal_akhir=&nilai_awal=0&nilai_akhir=10000000000&status_verifikasi=&lb_status_verifikasi=Tampilkan+Semua&status_dokumen=&lb_status_dokumen=Aktif&jenis_dokumen=&lb_jenis_dokumen=Tampilkan+Semua&status_dokumen_pnp=&lb_status_dokumen_pnp=Tampilkan+Semua&keterangan=&skpd=0&lb_skpd=Tampilkan+Semua&sub_skpd=0&lb_sub_skpd=Tampilkan+Semua
        url: config.service_url+'pengeluaran/strict/npd/index?page='+page+'&limit=5&nomor=&tanggal_mulai=&tanggal_akhir=&nilai_awal=0&nilai_akhir=10000000000&status_verifikasi=&lb_status_verifikasi=Tampilkan+Semua&status_dokumen=&lb_status_dokumen=Aktif&jenis_dokumen=&lb_jenis_dokumen=Tampilkan+Semua&status_dokumen_pnp=&lb_status_dokumen_pnp=Tampilkan+Semua&keterangan=&skpd=0&lb_skpd=Tampilkan+Semua&sub_skpd=0&lb_sub_skpd=Tampilkan+Semua',
        type: 'get',
        success: function (response) {
            console.log('NPD', response);
            if(response!=null && response.length >= 1){
                response.map(function(b, i){
                    response_all.push(b);
                })
                singkron_npd_lokal_per_skpd(page+1, response_all, cb);
            }else{
                cb(response_all);
            }
        },
    });
}

function singkron_npd_ke_lokal_skpd(current_data, callback) {
    var spm = {
        action: "singkron_npd",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,
        sumber: 'ri',
        page: current_data.page,
        data: {}
    };

    spm.data[0] = {}
    spm.data[0].id_npd = current_data.id_npd;
    spm.data[0].nomor_npd = current_data.nomor_npd;
    spm.data[0].tahun = current_data.tahun;
    spm.data[0].id_daerah = current_data.id_daerah;
    spm.data[0].id_unit = current_data.id_unit;
    spm.data[0].id_skpd = current_data.id_skpd;
    spm.data[0].id_sub_skpd = current_data.id_sub_skpd;
    spm.data[0].nilai_npd = current_data.nilai_npd;
    spm.data[0].nilai_npd_disetujui = current_data.nilai_npd_disetujui;
    spm.data[0].tanggal_npd = current_data.tanggal_npd;
    spm.data[0].tanggal_npd_selesai = current_data.tanggal_npd_selesai;
    spm.data[0].keterangan_npd = current_data.keterangan_npd;
    spm.data[0].is_verifikasi_npd = current_data.is_verifikasi_npd;
    spm.data[0].verifikasi_npd_at = current_data.verifikasi_npd_at;
    spm.data[0].verifikasi_npd_by = current_data.verifikasi_npd_by;
    spm.data[0].verifikasi_npd_by_name = current_data.nilai_spm;
    spm.data[0].verifikasi_npd_by_nip = current_data.verifikasi_npd_by_nip;
    spm.data[0].verifikasi_npd_by_role = current_data.verifikasi_npd_by_role;
    spm.data[0].nomor_verifikasi = current_data.nomor_verifikasi;
    spm.data[0].is_npd_panjar = current_data.is_npd_panjar;
    spm.data[0].kondisi_selesai = current_data.kondisi_selesai;
    spm.data[0].selesai_at = current_data.selesai_at;
    spm.data[0].selesai_by = current_data.selesai_by;
    spm.data[0].nilai_pengembalian = current_data.nilai_pengembalian;
    spm.data[0].nilai_kurang_bayar = current_data.nilai_kurang_bayar;
    spm.data[0].nomor_kurang_lebih = current_data.nomor_kurang_lebih;
    spm.data[0].kurang_lebih_at = current_data.kurang_lebih_at;
    spm.data[0].kurang_lebih_by = current_data.kurang_lebih_by;
    spm.data[0].is_validasi_npd = current_data.is_validasi_npd;
    spm.data[0].validasi_npd_at = current_data.validasi_npd_at;
    spm.data[0].validasi_npd_by = current_data.validasi_npd_by;
    spm.data[0].validasi_npd_by_name = current_data.validasi_npd_by_name;
    spm.data[0].validasi_npd_by_nip = current_data.validasi_npd_by_nip;
    spm.data[0].validasi_npd_by_role = current_data.validasi_npd_by_role;
    spm.data[0].is_tbp = current_data.is_tbp;
    spm.data[0].tbp_at = current_data.tbp_at;
    spm.data[0].tbp_by = current_data.tbp_by;
    spm.data[0].id_jadwal = current_data.id_jadwal;
    spm.data[0].id_tahap = current_data.id_tahap;
    spm.data[0].status_tahap = current_data.status_tahap;
    spm.data[0].kode_tahap = current_data.kode_tahap;
    spm.data[0].nip_pegawai_pptk = current_data.id_tahap;
    spm.data[0].kode_tahap = current_data.kode_tahap;
    spm.data[0].created_at = current_data.created_at;
    spm.data[0].created_by = current_data.created_by;
    spm.data[0].updated_at = current_data.updated_at;
    spm.data[0].updated_by = current_data.updated_by;
    spm.data[0].deleted_at = current_data.deleted_at;
    spm.data[0].deleted_by = current_data.deleted_by;
    spm.data[0].kode_skpd = current_data.kode_skpd;
    spm.data[0].nama_skpd = current_data.nama_skpd;
    spm.data[0].kode_sub_skpd = current_data.kode_sub_skpd;
    spm.data[0].nama_sub_skpd = current_data.nama_sub_skpd;
    spm.data[0].total_pertanggungjawaban = current_data.total_pertanggungjawaban;
    spm.data[0].tbp_id = current_data.tbp.id;
    spm.data[0].tbp_nomor = current_data.tbp.nomor;
    spm.data[0].tbp_nilai = current_data.tbp.nilai;
    spm.data[0].tbp_created_at = current_data.tbp.created_at;
    spm.data[0].tbp_is_lpj = current_data.tbp.is_lpj;

    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal,
                type: "post",
                data: spm,
                return: false
            },
        },
    };
    chrome.runtime.sendMessage(data_back, (resp) => {
        pesan_loading("Kirim data NPD ID SKPD="+current_data.id_skpd+" keterangan = "+current_data.keterangan_npd);
    });
    // if(tipe == 'UP'){
    //     return callback();
    // }

    new Promise(function (resolve, reject) {
        jQuery.ajax({
            url: config.service_url + "pengeluaran/strict/npd/cetak/" + current_data.id_npd,
            type: 'get',
            dataType: "JSON",
            beforeSend: function (xhr) {                
                xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
            },
            success: function (res) {
                console.log('response detail NPD', res);
                var spm_detail = {
                    action: "singkron_npd_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_npd: current_data.id_npd,                    
                    sumber: 'ri',
                    data: res[res]
                };
                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: spm_detail,
                            return: true
                        },
                    }
                };
                chrome.runtime.sendMessage(data_back, (resp) => {
                    window.singkron_spm_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data NPD detail ID="+current_data.id_npd);
                });
            },
            error: function(err){
                console.log('Error get detail NPD! id='+current_data.id_npd, err);
                resolve();
            }
        });
    })
    .then(function () {
        callback();
    });
}        