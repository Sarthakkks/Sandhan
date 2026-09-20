import * as fs from 'fs';
import * as path from 'path';

const dataDir = path.join(__dirname);

function generateCDR() {
    const header = "caller_no,called_no,starttime,duration_sec,deviceid,cell_id\n";
    const data = [
        "9810000001,1800000000,2024-01-15T09:55:00Z,120,,Cell-101",
        "9810000001,9820000002,2024-01-15T09:58:00Z,45,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:00:00Z,30,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:00:45Z,25,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:01:20Z,10,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:01:40Z,15,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:02:00Z,40,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:02:50Z,10,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:03:10Z,5,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:03:20Z,20,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:03:50Z,12,490154203237518,Cell-102",
        "9820000002,9830000003,2024-01-15T10:04:10Z,18,490154203237518,Cell-102",
        "9830000003,9840000004,2024-01-15T10:05:00Z,60,490154203237518,Cell-102",
        "9840000004,9850000005,2024-01-15T11:30:00Z,120,490154203237518,Cell-105"
    ];
    for(let i = 1; i <= 36; i++) {
        const caller = `9899999${String(i).padStart(3, '0')}`;
        const called = `9899999${String(i+100).padStart(3, '0')}`;
        data.push(`${caller},${called},2024-01-15T09:${String(10+(i%50)).padStart(2, '0')}:00Z,60,,Cell-${200+i}`);
    }
    fs.writeFileSync(path.join(dataDir, 'CDR.csv'), header + data.join('\n'));
}

function generateBank() {
    const header = "transaction_id,utr,sender_account,receiver_account,amount,timestamp,upi_id,transaction_type\n";
    const data = [
        "TXN001,UTR001,1234567890,2345678901,75000,2024-01-15T10:01:23Z,victim@upi,DEBIT",
        "TXN002,UTR002,2345678901,3456789012,74500,2024-01-15T10:02:47Z,mule@upi,TRANSFER",
        "TXN003,UTR003,3456789012,4567890123,74000,2024-01-15T10:04:12Z,inter@upi,TRANSFER",
        "TXN004,UTR004,4567890123,9999999999,73500,2024-01-15T10:06:33Z,cashout@upi,TRANSFER"
    ];
    for (let i = 101; i <= 110; i++) {
        data.push(`TXN${i},UTR${i},5555555551,5555555552,1000,2024-01-15T09:00:00Z,legit${i}@upi,TRANSFER`);
    }
    fs.writeFileSync(path.join(dataDir, 'Bank.csv'), header + data.join('\n'));
}

function generateIPDR() {
    const header = "ip_address,phone_number,session_start,session_end,bytes_transferred,port\n";
    const data = [
        "192.168.10.42,9810000001,2024-01-15T10:00:10Z,2024-01-15T10:02:00Z,102400,443",
        "192.168.10.42,9820000002,2024-01-15T10:02:05Z,2024-01-15T10:04:30Z,204800,443",
        "192.168.10.42,9830000003,2024-01-15T10:03:50Z,2024-01-15T10:05:15Z,153600,443",
        "10.0.0.55,9840000004,2024-01-15T11:30:00Z,2024-01-15T11:45:00Z,512000,443"
    ];
    for (let i = 1; i <= 10; i++) {
        data.push(`8.8.8.${i},9899999001,2024-01-15T09:00:00Z,2024-01-15T09:10:00Z,10000,80`);
    }
    fs.writeFileSync(path.join(dataDir, 'IPDR.csv'), header + data.join('\n'));
}

function generateDevice() {
    const deviceData = {
        "imei": "490154203237518",
        "imsi": "404101234567890",
        "device_model": "Redmi Note 12",
        "manufacturer": "Xiaomi",
        "android_version": "13",
        "first_seen": "2024-01-10T08:00:00",
        "last_seen": "2024-01-15T10:05:00",
        "sim_history": [
            { "msisdn": "9820000002", "imsi": "404101234567890", "start": "2024-01-10T08:00:00", "end": "2024-01-15T10:03:00" },
            { "msisdn": "9830000003", "imsi": "404101234567891", "start": "2024-01-15T10:03:01", "end": "2024-01-15T10:05:00" },
            { "msisdn": "9840000004", "imsi": "404101234567892", "start": "2024-01-15T11:25:00", "end": null }
        ],
        "installed_apps": [
            { "package": "com.phonepe.app", "installed": "2023-12-01", "last_used": "2024-01-15T10:04:55" },
            { "package": "net.one97.paytm", "installed": "2023-11-15", "last_used": "2024-01-15T10:02:30" },
            { "package": "com.google.android.apps.nbu.paisa.user", "installed": "2024-01-01", "last_used": "2024-01-15T10:01:55" },
            { "package": "com.whatsapp", "installed": "2023-01-01", "last_used": "2024-01-15T09:58:00" }
        ],
        "network_logs": [
            { "timestamp": "2024-01-15T10:02:05", "ip": "192.168.10.42", "action": "connect", "app": "com.phonepe.app" },
            { "timestamp": "2024-01-15T10:03:50", "ip": "192.168.10.42", "action": "connect", "app": "net.one97.paytm" }
        ]
    };
    fs.writeFileSync(path.join(dataDir, 'device.json'), JSON.stringify(deviceData, null, 2));
}

// Generate all files
generateCDR();
generateBank();
generateIPDR();
generateDevice();
console.log('Synthetic data generated successfully!');
