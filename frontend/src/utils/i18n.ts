export type Language = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'mr';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.ingest': 'Ingest Data',
    'nav.mapping': 'Schema Mapping',
    'nav.graph': 'Graph Visualization',
    'nav.brief': 'Investigative Brief',
    'nav.audit': 'Audit Log',
    'nav.logout': 'Logout',
    
    // Dashboard
    'dashboard.title': 'SANDHAN Fraud Intelligence Overview',
    'dashboard.subtitle': 'Real-time evidence correlation & risk assessment dashboard.',
    'dashboard.total_files': 'Evidence Files',
    'dashboard.total_entities': 'Correlated Entities',
    'dashboard.high_risk': 'High Risk Leads',
    'dashboard.graph_edges': 'Graph Linkages',
    'dashboard.suspect_trail': 'Primary Fraud Trail (UPI & IMEI Correlation)',
    'dashboard.top_leads': 'Top Suspect Investigative Leads',
    'dashboard.quick_actions': 'Quick Actions',
    'dashboard.run_analysis': 'Run Full Analysis',
    'dashboard.view_graph': 'View Case Graph',
    'dashboard.view_brief': 'Generate Brief Report',
    
    // Ingest
    'ingest.title': 'Evidence Ingestion & Chain of Custody',
    'ingest.subtitle': 'Upload CDR, UPI/Bank CSV, IPDR, and Device JSON evidence files.',
    'ingest.dropzone': 'Drag & Drop Evidence Files Here or Click to Browse',
    'ingest.ledger': 'Evidence Ledger (SHA-256 Hashed)',
    'ingest.col_name': 'File Name',
    'ingest.col_type': 'File Type',
    'ingest.col_size': 'File Size',
    'ingest.col_hash': 'SHA-256 Hash',
    'ingest.col_date': 'Ingested At',
    'ingest.col_status': 'Hash Status',
    'ingest.col_actions': 'Actions',
    'ingest.verify': 'Verify Hash',
    'ingest.proceed_mapping': 'Proceed to Schema Mapping',
    'ingest.verified': 'Cryptographically Verified',
    'ingest.pending': 'Integrity Intact',
    
    // Mapping
    'mapping.title': 'Canonical Schema Mapping',
    'mapping.subtitle': 'Map evidence columns to standard fields for entity extraction.',
    'mapping.auto_map': 'Auto-Suggest Mappings',
    'mapping.run_pipeline': 'Save & Run Correlation Analysis',
    
    // Graph
    'graph.live_graph': 'Live Case Graph',
    'graph.entities': 'Entities',
    'graph.relations': 'Relations',
    'graph.anchor': 'Anchor Time',
    'graph.leads_title': 'Investigative Leads',
    'graph.node_details': 'Entity Details',
    'graph.edge_details': 'Linkage Details',
    'graph.risk_score': 'Risk Score',
    'graph.confidence': 'Confidence Level',
    
    // Brief
    'brief.title': 'Investigative Brief',
    'brief.subtitle': 'Auto-generated court-admissible narrative report with Bhashini translation.',
    'brief.generate': 'Generate Brief',
    'brief.download': 'Download HTML Report',
    'brief.share': 'Share Report',
    
    // Audit
    'audit.title': 'Immutable Audit Ledger',
    'audit.subtitle': 'Cryptographic log of all user actions, file accesses, and analysis runs.',
    'audit.col_user': 'User',
    'audit.col_action': 'Action',
    'audit.col_resource': 'Resource',
    'audit.col_time': 'Timestamp',
    'audit.col_ip': 'IP Address',
  },
  hi: {
    // Nav
    'nav.dashboard': 'डैशबोर्ड',
    'nav.ingest': 'डेटा प्रविष्टि (Ingest)',
    'nav.mapping': 'स्कीमा मैपिंग',
    'nav.graph': 'ग्राफ विज़ुअलाइज़ेशन',
    'nav.brief': 'जांच विवरण (Brief)',
    'nav.audit': 'ऑडिट लॉग',
    'nav.logout': 'लॉग आउट',
    
    // Dashboard
    'dashboard.title': 'संधान - साक्ष्य आधारित साइबर धोखाधड़ी जांच प्रणाली',
    'dashboard.subtitle': 'वास्तविक समय साक्ष्य सहसंबंध एवं जोखिम मूल्यांकन डैशबोर्ड।',
    'dashboard.total_files': 'साक्ष्य फाइलें',
    'dashboard.total_entities': 'संबद्ध संस्थाएं',
    'dashboard.high_risk': 'उच्च जोखिम सुराग',
    'dashboard.graph_edges': 'ग्राफ कड़ियां (Linkages)',
    'dashboard.suspect_trail': 'मुख्य धोखाधड़ी मार्ग (यूपीआई एवं आईएमईआई सहसंबंध)',
    'dashboard.top_leads': 'शीर्ष संदिग्ध जांच सुराग (Investigative Leads)',
    'dashboard.quick_actions': 'त्वरित कार्रवाइयां',
    'dashboard.run_analysis': 'पूर्ण विश्लेषण चलाएं',
    'dashboard.view_graph': 'केस ग्राफ देखें',
    'dashboard.view_brief': 'जांच विवरण रिपोर्ट जनरेट करें',
    
    // Ingest
    'ingest.title': 'साक्ष्य प्रविष्टि एवं कस्टडी श्रृंखला',
    'ingest.subtitle': 'सीडीआर (CDR), बैंक यूपीआई, आईपीडीआर तथा डिवाइस डेटा फाइलें अपलोड करें।',
    'ingest.dropzone': 'साक्ष्य फाइलों को यहां ड्रैग व ड्रॉप करें अथवा ब्राउज करें',
    'ingest.ledger': 'साक्ष्य लेजर (SHA-256 हैश द्वारा सुरक्षित)',
    'ingest.col_name': 'फाइल का नाम',
    'ingest.col_type': 'फाइल प्रकार',
    'ingest.col_size': 'आकार',
    'ingest.col_hash': 'SHA-256 हैश कोड',
    'ingest.col_date': 'अपलोड समय',
    'ingest.col_status': 'हैश स्थिति',
    'ingest.col_actions': 'कार्रवाई',
    'ingest.verify': 'हैश सत्यापित करें',
    'ingest.proceed_mapping': 'स्कीमा मैपिंग पर आगे बढ़ें',
    'ingest.verified': 'सत्यापित (Verified)',
    'ingest.pending': 'सुरक्षित',
    
    // Mapping
    'mapping.title': 'मानक स्कीमा मैपिंग',
    'mapping.subtitle': 'संबद्ध संस्था निष्कर्षण हेतु साक्ष्य कॉलमों को मानक फ़ील्ड में मैप करें।',
    'mapping.auto_map': 'स्वचालित मैपिंग सुझाएं',
    'mapping.run_pipeline': 'सहेजें एवं विश्लेषण चलाएं',
    
    // Graph
    'graph.live_graph': 'लाइव केस ग्राफ',
    'graph.entities': 'संस्थाएं (Entities)',
    'graph.relations': 'संबंध (Relations)',
    'graph.anchor': 'मुख्य समय (Anchor)',
    'graph.leads_title': 'प्राथमिकता सुराग (Leads)',
    'graph.node_details': 'संस्था का विवरण',
    'graph.edge_details': 'संबंध विवरण',
    'graph.risk_score': 'जोखिम स्कोर',
    'graph.confidence': 'विश्वसनीयता स्तर',
    
    // Brief
    'brief.title': 'जांच विवरण एवं रिपोर्ट (Investigative Brief)',
    'brief.subtitle': 'भाषिणी अनुवाद के साथ स्वचालित रूप से जनरेट की गई अदालत-स्वीकार्य रिपोर्ट।',
    'brief.generate': 'जांच रिपोर्ट जनरेट करें',
    'brief.download': 'एचटीएमएल रिपोर्ट डाउनलोड करें',
    'brief.share': 'रिपोर्ट शेयर करें',
    
    // Audit
    'audit.title': 'अपरिवर्तनीय ऑडिट लेजर',
    'audit.subtitle': 'सभी उपयोगकर्ता कार्रवाइयों एवं विश्लेषण गतिविधियों का सुरक्षित क्रिप्टोग्राफिक लॉग।',
    'audit.col_user': 'उपयोगकर्ता',
    'audit.col_action': 'कार्रवाई',
    'audit.col_resource': 'संसाधन',
    'audit.col_time': 'समय',
    'audit.col_ip': 'आईपी पता',
  },
  ta: {} as any,
  te: {} as any,
  kn: {} as any,
  mr: {} as any,
};

export function useTranslation(lang: Language) {
  const dict = translations[lang] || translations['hi'] || translations['en'];
  return (key: string): string => {
    return dict[key] || translations['en'][key] || key;
  };
}
