import { Pool } from 'pg'
export const pool=new Pool({
    host:'ec2-52-6-77-239.compute-1.amazonaws.com',
    user:'cbbsgrquyzisnh',
    password:'90a89d853b92a4ecb1f0eae4d64a31ce802b170cdb62aaaf01c556d362068f0f',
    database:'d8lrb218qkclqo',
    port:5432,
    ssl:{rejectUnauthorized:false}
});