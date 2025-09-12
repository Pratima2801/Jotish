import axios from 'axios';
import { parseRowsToObjects } from '../utils/dataParser';

const API_URL = '/api/gettabledata.php';

// small fallback sample (used if API fails)
const FALLBACK_ROWS = [
  ["Tiger Nixon","System Architect","Edinburgh","5421","2011/04/25","$320,800"],
  ["Garrett Winters","Accountant","Tokyo","8422","2011/07/25","$170,750"],
  ["Ashton Cox","Junior Technical Author","San Francisco","1562","2009/01/12","$86,000"],
  ["Cedric Kelly","Senior Javascript Developer","Edinburgh","6224","2012/03/29","$433,060"],
  ["Airi Satou","Accountant","Tokyo","5407","2008/11/28","$162,700"]
];

export async function fetchTableData() {
  try {
    const payload = { username: 'test', password: '123456' };
    const resp = await axios.post(API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 8000
    });
    console.log(resp);
   
    const rows = resp?.data?.TABLE_DATA?.data ?? resp?.data?.data ?? null;
    if (!rows) {
      console.warn('fetchTableData: unexpected response, using fallback data');
      return parseRowsToObjects(FALLBACK_ROWS);
    }
    return parseRowsToObjects(rows);
  } catch (err) {
    console.error('fetchTableData error:', err?.message ?? err);
    
    return parseRowsToObjects(FALLBACK_ROWS);
  }
}
