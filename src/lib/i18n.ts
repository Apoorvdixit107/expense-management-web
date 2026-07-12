type ProfileLabels = {
  title: string;
  subtitle: string;
  personalInfo: string;
  emailNote: string;
  fullName: string;
  phone: string;
  currency: string;
  language: string;
  profilePhoto: string;
  uploadPhoto: string;
  removePhoto: string;
  save: string;
  saving: string;
  signedInVia: string;
  lastUpdated: string;
  preferences: string;
  preferencesNote: string;
};

const LABELS: Record<string, ProfileLabels> = {
  "en-IN": {
    title: "Account",
    subtitle: "View and update your personal information",
    personalInfo: "Personal information",
    emailNote: "Email is tied to your login and cannot be changed here.",
    fullName: "Full name",
    phone: "Phone",
    currency: "Account currency",
    language: "Language",
    profilePhoto: "Profile photo",
    uploadPhoto: "Upload photo",
    removePhoto: "Remove photo",
    save: "Save changes",
    saving: "Saving...",
    signedInVia: "Signed in via",
    lastUpdated: "Last updated",
    preferences: "Regional preferences",
    preferencesNote: "Currency and language apply across amounts and dates in the app.",
  },
  "en-US": {
    title: "Account",
    subtitle: "View and update your personal information",
    personalInfo: "Personal information",
    emailNote: "Email is tied to your login and cannot be changed here.",
    fullName: "Full name",
    phone: "Phone",
    currency: "Account currency",
    language: "Language",
    profilePhoto: "Profile photo",
    uploadPhoto: "Upload photo",
    removePhoto: "Remove photo",
    save: "Save changes",
    saving: "Saving...",
    signedInVia: "Signed in via",
    lastUpdated: "Last updated",
    preferences: "Regional preferences",
    preferencesNote: "Currency and language apply across amounts and dates in the app.",
  },
  "hi-IN": {
    title: "प्रोफ़ाइल",
    subtitle: "अपनी व्यक्तिगत जानकारी देखें और अपडेट करें",
    personalInfo: "व्यक्तिगत जानकारी",
    emailNote: "ईमेल आपके लॉगिन से जुड़ा है और यहाँ बदला नहीं जा सकता।",
    fullName: "पूरा नाम",
    phone: "फ़ोन",
    currency: "खाता मुद्रा",
    language: "भाषा",
    profilePhoto: "प्रोफ़ाइल फ़ोटो",
    uploadPhoto: "फ़ोटो अपलोड करें",
    removePhoto: "फ़ोटो हटाएँ",
    save: "परिवर्तन सहेजें",
    saving: "सहेजा जा रहा है...",
    signedInVia: "साइन इन",
    lastUpdated: "अंतिम अपडेट",
    preferences: "क्षेत्रीय प्राथमिकताएँ",
    preferencesNote: "मुद्रा और भाषा पूरे ऐप में राशि और तारीखों पर लागू होती है।",
  },
  "es-ES": {
    title: "Perfil",
    subtitle: "Ver y actualizar tu información personal",
    personalInfo: "Información personal",
    emailNote: "El correo está vinculado a tu acceso y no se puede cambiar aquí.",
    fullName: "Nombre completo",
    phone: "Teléfono",
    currency: "Moneda de la cuenta",
    language: "Idioma",
    profilePhoto: "Foto de perfil",
    uploadPhoto: "Subir foto",
    removePhoto: "Eliminar foto",
    save: "Guardar cambios",
    saving: "Guardando...",
    signedInVia: "Inicio de sesión con",
    lastUpdated: "Última actualización",
    preferences: "Preferencias regionales",
    preferencesNote: "La moneda y el idioma se aplican a importes y fechas en la app.",
  },
  "fr-FR": {
    title: "Profil",
    subtitle: "Voir et mettre à jour vos informations personnelles",
    personalInfo: "Informations personnelles",
    emailNote: "L'e-mail est lié à votre connexion et ne peut pas être modifié ici.",
    fullName: "Nom complet",
    phone: "Téléphone",
    currency: "Devise du compte",
    language: "Langue",
    profilePhoto: "Photo de profil",
    uploadPhoto: "Télécharger une photo",
    removePhoto: "Supprimer la photo",
    save: "Enregistrer",
    saving: "Enregistrement...",
    signedInVia: "Connecté via",
    lastUpdated: "Dernière mise à jour",
    preferences: "Préférences régionales",
    preferencesNote: "La devise et la langue s'appliquent aux montants et dates dans l'application.",
  },
  "de-DE": {
    title: "Profil",
    subtitle: "Persönliche Daten anzeigen und aktualisieren",
    personalInfo: "Persönliche Daten",
    emailNote: "Die E-Mail ist mit Ihrer Anmeldung verknüpft und kann hier nicht geändert werden.",
    fullName: "Vollständiger Name",
    phone: "Telefon",
    currency: "Kontowährung",
    language: "Sprache",
    profilePhoto: "Profilbild",
    uploadPhoto: "Foto hochladen",
    removePhoto: "Foto entfernen",
    save: "Änderungen speichern",
    saving: "Speichern...",
    signedInVia: "Angemeldet über",
    lastUpdated: "Zuletzt aktualisiert",
    preferences: "Regionale Einstellungen",
    preferencesNote: "Währung und Sprache gelten für Beträge und Datumsangaben in der App.",
  },
  "ar-AE": {
    title: "الملف الشخصي",
    subtitle: "عرض وتحديث معلوماتك الشخصية",
    personalInfo: "المعلومات الشخصية",
    emailNote: "البريد الإلكتروني مرتبط بتسجيل الدخول ولا يمكن تغييره هنا.",
    fullName: "الاسم الكامل",
    phone: "الهاتف",
    currency: "عملة الحساب",
    language: "اللغة",
    profilePhoto: "صورة الملف الشخصي",
    uploadPhoto: "رفع صورة",
    removePhoto: "إزالة الصورة",
    save: "حفظ التغييرات",
    saving: "جارٍ الحفظ...",
    signedInVia: "تم تسجيل الدخول عبر",
    lastUpdated: "آخر تحديث",
    preferences: "التفضيلات الإقليمية",
    preferencesNote: "تُطبَّق العملة واللغة على المبالغ والتواريخ في التطبيق.",
  },
};

export function profileLabels(locale: string): ProfileLabels {
  return LABELS[locale] ?? LABELS["en-IN"];
}
