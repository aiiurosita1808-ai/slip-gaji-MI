import fetch from 'node-fetch';
import FormData from 'form-data';

const token = "Fj34XJCidbFweDCyv65z";
const formData = new FormData();
formData.append('target', '085718717833');
formData.append('message', 'Test scheduled');
const scheduleStr = "2026-08-27 15:30:00"; // format maybe? Or millis? Or "0"? let's use delay instead to be safe?
// Wait, delay works for sure. delay is in seconds.
// schedule is "0" for immediate, or a date string? Let's check fonnte docs online.
