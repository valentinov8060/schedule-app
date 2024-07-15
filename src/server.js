import { app } from './routers/main-router.js';
import os from 'os';
import 'dotenv/config';

const getServerIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
};

const port = process.env.PORT || 3000;
const serverIp = getServerIpAddress();

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port} with IP address ${serverIp}`);
});
