import React from "react";
import DeleteButton from "./DeleteButton";
import floyd from "../assets/images/floyd.png";
import robet from "../assets/images/robet.png";
import cody from "../assets/images/cody.png";

export const PenggunaData = [
    {   
        fotoprofil: <img src={floyd} alt='floyd' />,
        nama: 'Floyid Miles',
        username: 'floyid',
        email:  'floyid211@gmail.com',
        notelp: '0813-3333-3333',
        password: '*******',
        aksi: <DeleteButton/>,
    },
    {   
        fotoprofil: <img src={robet} alt='robet' />,
        nama: 'Robet Fox',
        username: 'robet',
        email:  'fox224@gmail.com',
        notelp: '0813-3333-3333',
        password: '*******',
        aksi: <DeleteButton/>,
    },
    {   
        fotoprofil: <img src={cody} alt='cody' />,
        nama: 'Cody Fisher',
        username: 'cody',
        email:  'fisercody@gmail.com',
        notelp: '0813-3333-3333',
        password: '*******',
        aksi: <DeleteButton/>,
    }
]