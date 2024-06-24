// LaporanData.js
import React from 'react';
import DeleteButton from './DeleteButton';

export const LaporanData = [
    {
        nama: 'Cody Fisher',
        email: 'fisercody@gmail.com',
        tanggal: '12 September 2023',
        lokasi: 'Depan Pasar Sukaramai',
        deskripsi: 'Setiap orang yang pernah mengunjungi...',
        status: 'Selesai',
        aksi: <DeleteButton />
    },
    {
        nama: 'Robet Fox',
        email: 'fox224@gmail.com',
        tanggal: '12 September 2023',
        lokasi: 'Jalan Taruma ini persis di depan Masjid Jamik',
        deskripsi: 'Jalan Taruma ini letaknya tidak jauh dari Kantor KPU Med...',
        status: 'Diproses',
        aksi: <DeleteButton />
    },
    {
        nama: 'Floyid Miles',
        email: 'floyid211@gmail.com',
        tanggal: '11 September 2023',
        lokasi: 'Kantor Dinas Pemuda dan Olahraga dan Dinas Kesehatan Medan.',
        deskripsi: 'Lokasinya tidak jauh dari Kantor Dinas Pemuda dan Olahraga dan... ',
        status: 'Menunggu',
        aksi: <DeleteButton />
    }
];
