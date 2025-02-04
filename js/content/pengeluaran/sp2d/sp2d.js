function singkron_sp2d_lokal(bulan){
    if(bulan == '' || bulan == 'undefined' || bulan == 0){
        return alert('Bulan Belum dipilih !!!');
    }
    var id_status = prompt('Masukan ID status SP2D yang mau dibackup. 1=ditransfer (Sudah Ditransfer), 2=proses_transfer (Sedang Diproses), 3=diterima (Belum Ditransfer), 4=gagal_transfer (Transfer Gagal), 5=dihapus, 6=ditolak', 1);

    var status = 'ditransfer';
    if(id_status == '2'){
        status = 'proses_transfer';
    }else if(id_status == '3'){
        status = 'diterima';
    }else if(id_status == '4'){
        status = 'gagal_transfer';
    }else if(id_status == '5'){
        status = 'dihapus';
    }else if(id_status == '6'){
        status = 'ditolak';
    }

    jQuery('#wrap-loading').show();
    pesan_loading('Get data SP2D Bulan '+bulan);
    singkron_sp2d_lokal_per_jenis(bulan, status, 1, [], function(response){
        var page_skpd = {};
        var last = response.length-1;
        response.reduce(function (sequence, nextData) {
            return sequence.then(function (current_data) {
                return new Promise(function (resolve_reduce, reject_reduce) {
                    pesan_loading('Get SP2D ID SP2D "'+current_data.id_sp_2_d+'" dari ID SKPD "'+current_data.id_skpd+'"');
                    if(!page_skpd[current_data.id_skpd]){
                        page_skpd[current_data.id_skpd] = [];
                    }
                    page_skpd[current_data.id_skpd].push(current_data);

                    // melakukan reset page sesuai data per skpd
                    current_data.page = page_skpd[current_data.id_skpd].length;

                    singkron_sp2d_ke_lokal_skpd(current_data, bulan, status, ()=>{
                        resolve_reduce(nextData);
                    });
                })
                .catch(function(e){
                    console.error('Error in promise chain (singkron_sp2d_lokal reduce):', e); // Log error here
                    return Promise.resolve(nextData);
                });
            })
            .catch(function(e){
                console.error('Error in sequence promise (singkron_sp2d_lokal reduce):', e); // Log error here
                return Promise.resolve(nextData);
            });
        }, Promise.resolve(response[last]))
        .then(function (data_last) {
            jQuery("#wrap-loading").hide();
            alert("Berhasil singkron SP2D");
        });
    });
}
//5 seconds
function singkron_sp2d_lokal_per_jenis(bulan, status, page=1, response_all=[], cb, jumlah_page=false){
    if(jumlah_page!=false){
        pesan_loading('Get data SP2D Bulan "'+bulan+'" , status='+status+', halaman='+page+' dari total '+jumlah_page+' halaman');
    }else{
        pesan_loading('Get data SP2D Bulan "'+bulan+'" , status='+status+', halaman='+page);
    }
    var url = config.service_url+'pengeluaran/strict/sp2d/pembuatan/index?status='+status+'&page='+page+'&nomor_sp2d=/'+bulan+'/'+_token.tahun+'&limit=10';
    if(bulan == 'Semua Bulan'){
        url = config.service_url+'pengeluaran/strict/sp2d/pembuatan/index?status='+status+'&page='+page+'&limit=10';
    }
    relayAjaxApiKey({
        url: url,
        type: 'get',
        success: function (response, textStatus, request) {
            console.log('SP2D', response, textStatus, request);
            if(response == 'Too Many Requests'){
                setTimeout(function(){
                    singkron_sp2d_lokal_per_jenis(bulan, status, page, response_all, cb);
                }, (Math.random()*5)*1000);
            }else{
                var jumlah_page = request.getResponseHeader('x-pagination-page-count');
                response.map(function(b, i){
                    response_all.push(b);
                });
                if(page < jumlah_page){
                    singkron_sp2d_lokal_per_jenis(bulan,  status, page+1, response_all, cb, jumlah_page);
                }else{
                    cb(response_all);
                }
            }
        },
    });
}

function singkron_sp2d_ke_lokal_skpd(current_data, bulan, status, callback) {
    console.log('Start singkron_sp2d_ke_lokal_skpd', current_data.id_sp_2_d); // Start log
    var tipe = current_data.jenis_sp_2_d;
    var sp2d = {
        action: "singkron_sp2d",
        tahun_anggaran: _token.tahun,
        api_key: config.api_key,
        idSkpd: current_data.id_skpd,
        tipe: tipe,
        sumber: 'ri',
        page: current_data.page,
        data: []
    };
    console.log('singkron sp2d',current_data);
    sp2d.data = {};
    sp2d.data.bulan_gaji = current_data.bulan_gaji;
    sp2d.data.bulan_tpp = current_data.bulan_tpp;
    sp2d.data.created_at = current_data.created_at;
    sp2d.data.created_by = current_data.created_by;
    sp2d.data.deleted_at = current_data.deleted_at;
    sp2d.data.deleted_by = current_data.deleted_by;
    sp2d.data.id_bank = current_data.id_bank;
    sp2d.data.id_daerah = current_data.id_daerah;
    sp2d.data.id_jadwal = current_data.id_jadwal;
    sp2d.data.id_pegawai_bud_kbud = current_data.id_pegawai_bud_kbud;
    sp2d.data.id_rkud = current_data.id_rkud;
    sp2d.data.id_skpd = current_data.id_skpd;
    sp2d.data.id_sp_2_d = current_data.id_sp_2_d;
    sp2d.data.id_spm = current_data.id_spm;
    sp2d.data.id_sub_skpd = current_data.id_sub_skpd;
    sp2d.data.id_sumber_dana = current_data.id_sumber_dana;
    sp2d.data.id_tahap = current_data.id_tahap;
    sp2d.data.id_unit = current_data.id_unit;
    sp2d.data.is_gaji = current_data.is_gaji;
    sp2d.data.is_kunci_rekening_sp_2_d = current_data.is_kunci_rekening_sp_2_d;
    sp2d.data.is_pelimpahan = current_data.is_pelimpahan;
    sp2d.data.is_status_perubahan = current_data.is_status_perubahan;
    sp2d.data.is_tpp = current_data.is_tpp;
    sp2d.data.is_transfer_sp_2_d = current_data.is_transfer_sp_2_d;
    sp2d.data.is_verifikasi_sp_2_d = current_data.is_verifikasi_sp_2_d;
    sp2d.data.jenis_gaji = current_data.jenis_gaji;
    sp2d.data.jenis_ls_sp_2_d = current_data.jenis_ls_sp_2_d;
    sp2d.data.jenis_rkud = current_data.jenis_rkud;
    sp2d.data.jenis_sp_2_d = current_data.jenis_sp_2_d;
    sp2d.data.jurnal_id = current_data.jurnal_id;
    sp2d.data.keterangan_sp_2_d = current_data.keterangan_sp_2_d;
    sp2d.data.keterangan_transfer_sp_2_d = current_data.keterangan_transfer_sp_2_d;
    sp2d.data.keterangan_verifikasi_sp_2_d = current_data.keterangan_verifikasi_sp_2_d;
    sp2d.data.kode_skpd = current_data.kode_skpd;
    sp2d.data.kode_sub_skpd = current_data.kode_sub_skpd;
    sp2d.data.kode_tahap = current_data.kode_tahap;
    sp2d.data.metode = current_data.metode;
    sp2d.data.nama_bank = current_data.nama_bank;
    sp2d.data.nama_bud_kbud = current_data.nama_bud_kbud;
    sp2d.data.nama_rek_bp_bpp = current_data.nama_rek_bp_bpp;
    sp2d.data.nama_skpd = current_data.nama_skpd;
    sp2d.data.nama_sub_skpd = current_data.nama_sub_skpd;
    sp2d.data.nilai_materai_sp_2_d = current_data.nilai_materai_sp_2_d;
    sp2d.data.nilai_sp_2_d = current_data.nilai_sp_2_d;
    sp2d.data.nip_bud_kbud = current_data.nip_bud_kbud;
    sp2d.data.no_rek_bp_bpp = current_data.no_rek_bp_bpp;
    sp2d.data.nomor_jurnal = current_data.nomor_jurnal;
    sp2d.data.nomor_sp_2_d = current_data.nomor_sp_2_d;
    sp2d.data.nomor_spm = current_data.nomor_spm;
    sp2d.data.status_aklap = current_data.status_aklap;
    sp2d.data.status_perubahan_at = current_data.status_perubahan_at;
    sp2d.data.status_perubahan_by = current_data.status_perubahan_by;
    sp2d.data.status_tahap = current_data.status_tahap;
    sp2d.data.tahun = current_data.tahun;
    sp2d.data.tahun_gaji = current_data.tahun_gaji;
    sp2d.data.tahun_tpp = current_data.tahun_tpp;
    sp2d.data.tanggal_sp_2_d = current_data.tanggal_sp_2_d;
    sp2d.data.tanggal_spm = current_data.tanggal_spm;
    sp2d.data.transfer_sp_2_d_at = current_data.transfer_sp_2_d_at;
    sp2d.data.transfer_sp_2_d_by = current_data.transfer_sp_2_d_by;
    sp2d.data.updated_at = current_data.updated_at;
    sp2d.data.updated_by = current_data.updated_by;
    sp2d.data.verifikasi_sp_2_d_at = current_data.verifikasi_sp_2_d_at;
    sp2d.data.verifikasi_sp_2_d_by = current_data.verifikasi_sp_2_d_by;
    var data_back = {
        message: {
            type: "get-url",
            content: {
                url: config.url_server_lokal,
                type: "post",
                data: sp2d,
                return: false
            },
        },
    };

    console.log('Before sendMessage singkron_sp2d_ke_lokal_skpd', current_data.id_sp_2_d); // Log before sendMessage
    // Check if extension context is still valid
    if (!chrome.runtime?.id) {
        console.error('Extension context invalidated! Cannot send message');
        alert('Extension needs reload. Please refresh the page and try again.');
        return callback();
    }

    chrome.runtime.sendMessage(data_back, (resp) => {
        console.log('After sendMessage singkron_sp2d_ke_lokal_skpd - response received', current_data.id_sp_2_d); // Log after sendMessage response
        if (chrome.runtime.lastError) {
            console.error('Message send error:', chrome.runtime.lastError);
            // No callback here, simplify for debugging
        }
        pesan_loading("Kirim data SP2D ID SKPD="+current_data.id_skpd+" tipe="+tipe+" bulan="+bulan+" status="+status+" nomor="+current_data.nomor_sp_2_d);
    });

    // Add try-catch around async operations
    try {
        console.log('Before get_detail_sp2d', current_data.id_sp_2_d); // Log before get_detail_sp2d
        new Promise((resolve, reject) => {
            get_detail_sp2d(current_data, tipe, bulan, resolve);
        })
        .then(() => {
            console.log('After get_detail_sp2d - Promise resolved', current_data.id_sp_2_d); // Log after get_detail_sp2d resolve
            callback();
        })
        .catch(e => {
            console.error('Detail processing failed:', e);
            callback();
        });
    } catch (e) {
        console.error('Sync operation failed:', e);
        callback();
    }
    console.log('End singkron_sp2d_ke_lokal_skpd', current_data.id_sp_2_d); // End log
}

function get_detail_sp2d(current_data, tipe, bulan, resolve){
    console.log('Start get_detail_sp2d', current_data.id_sp_2_d); // Start log
    var url = config.service_url + "pengeluaran/strict/sp2d/pembuatan/cetak/" + current_data.id_sp_2_d;
    jQuery.ajax({
        url: url,
        type: 'get',
        dataType: "JSON",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", 'Bearer '+getCookie('X-SIPD-PU-TK'));
        },
        success: function (res) {
            if(res.message == 'Too Many Requests'){
                setTimeout(function(){
                    get_detail_sp2d(current_data, tipe, bulan, resolve);
                }, (Math.random()*5)*1000);
            }else{
                console.log('response detail sp2d', res);
                var sp2d_detail = {
                    action: "singkron_sp2d_detail",
                    tahun_anggaran: _token.tahun,
                    api_key: config.api_key,
                    idSkpd: current_data.id_skpd,
                    id_sp_2_d: current_data.id_sp_2_d,
                    tipe: tipe,
                    sumber: 'ri',
                    data: res[res.jenis.toLowerCase()]
                };
                var data_back = {
                    message: {
                        type: "get-url",
                        content: {
                            url: config.url_server_lokal,
                            type: "post",
                            data: sp2d_detail,
                            return: true
                        },
                    }
                };
                console.log('Before sendMessage get_detail_sp2d', current_data.id_sp_2_d); // Log before sendMessage
                chrome.runtime.sendMessage(data_back, (resp) => {
                    console.log('After sendMessage get_detail_sp2d - response received', current_data.id_sp_2_d); // Log after sendMessage response
                    window.singkron_sp2d_detail = {
                        resolve: resolve
                    };
                    pesan_loading("Kirim data SP2D detail ID="+current_data.id_sp_2_d+" bulan="+bulan+" tipe="+tipe);
                });
            }
        },
        error: function(err){
            if(
                err.responseJSON == 'Too Many Requests'
                || err.responseJSON == ''
                || err.responseText == 'Too Many Requests'
                || err.responseText == ''
            ){
                setTimeout(function(){
                    get_detail_sp2d(current_data, tipe, bulan, resolve);
                }, (Math.random()*5)*1000);
            }else{
                resolve();
            }
            console.error('Error get detail SP2D! id='+current_data.id_sp_2_d, err); // Use console.error for errors
        }
    });
    console.log('End get_detail_sp2d', current_data.id_sp_2_d); // End log
}