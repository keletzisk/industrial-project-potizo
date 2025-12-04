const greekTranslations = {
  // BACKEND FILE FOR BACKEND TRANSLATIONS

  MAX_TREES_ERROR_MSG: "Έχεις ήδη υιοθετήσει τον μέγιστο αριθμό δέντρων!",
  TREE_UNAVAILABLE_ERROR_MSG: "Το επιλεγμένο δέντρο έχει ήδη έναν ιδιοκτήτη!",
  TREE_NOT_BELONGING_TO_USER: "Το επιλεγμένο δέντρο δεν ανήκει στον χρήστη",
  NOT_EXISTING_TREE: "Δεν υπάρχει δέντρο με αυτόν τον κωδικό",

  // users-controllers
  TOO_SMALL_PASSWORD: "Απαιτείται μεγαλύτερος κωδικός",

  // UserRepository
  THIS_USER_EXISTS: "Αυτός ο χρήστης ήδη υπάρχει",
  USER_BLOCKED: "Ο χρήστης έχει μπλοκαριστεί.",
  USER_NOT_VERIFIED: "Ο χρήστης δεν επαληθεύτηκε.",
  USER_ALREADY_VERIFIED: "Ο χρήστης ήδη έχει επαληθευτεί",
  USER_NOT_EXISTS: "Ο χρήστης δεν βρέθηκε.",
  USER_HAS_SIGNED_UP_WITH_SOCIAL:
    "Η διεύθυνση email ήδη χρησιμοποιείται σε Σύνδεση με Google",
  USER_PENDING_VERIFICATION:
    "Ο χρήστης έχει κάνει εγγραφή και μένει η επαλήθευση του email.",

  // app.js

  VERIFICATION_CODE_EXPIRED: "Ο κωδικός επαλήθευσης έχει λήξει.",
  VERIFICATION_CODE_INVALID: "Ο κωδικός επαλήθευσης δεν είναι έγκυρος.",

  INVALID_PASSWORD:
    "Αποτυχία σύνδεσης. Έλεγξε τη διεύθυνση και τον κωδικό σου.",

  TREE_WITH_REQUESTED_ZIP_CODE_NOT_FOUND:
    "Δε βρέθηκε δέντρο στον συγκεκριμένο ταχυδρομικό κώδικα.",
  NOTIFICATION_UNWATERED_MESSAGE:
    "Κάποια δέντρα σου παραμένουν απότιστα. Τα νεαρά δέντρα χρειάζονται περίπου 3-4 λίτρα κάθε μέρα, ανάλογα με την εποχή. Μπορείς να ποτίζεις καθημερινά ή 2 με 3 φορές την εβδομάδα, το πρωί ή ιδιαίτερα σε περιόδους έντονης ζέστης, το βράδυ.",
  NOTIFICATION_UNWATERED_HEADER: "Κάποια δέντρα σου παραμένουν απότιστα.",

  VALIDATION_FAILED:
    "Παρακαλούμε έλεγξε ότι τα στοιχεία που εισάγεις είναι σωστά.",
  AUTHORIZATION_PROBLEM: "Πρόβλημα κατά τον έλεγχο ταυτότητας",

  emailLanguage: {
    byMoTPotiZo: "Από την εφαρμογή του Δήμου Θεσσαλονίκης: «ΠοτίΖΩ»",
    youReceivedThisMessage:
      "Έλαβες αυτό το μήνυμα αυτόματα από την εφαρμογή «ΠοτίΖΩ». Αν έλαβες το μήνυμα εκ παραδρομής, παρακαλούμε αγνόησέ το και διάγραψέ το.",
    doNotReply:
      "Παρακαλούμε να μην απαντήσεις αυτό το αυτοματοποιημένο μήνυμα.",
    verificationTheLinkWillBeActive:
      "Ο σύνδεσμος θα είναι ενεργός για τα επόμενα 30 λεπτά. Μετά το πέρας του χρόνου, η χρήση του συνδέσμου δεν είναι δυνατή και ο λογαριασμός διαγράφεται.",
    resetTheLinkWillBeActive:
      "Ο σύνδεσμος θα είναι ενεργός για τα επόμενα 30 λεπτά. Μετά το πέρας του χρόνου, η χρήση του συνδέσμου δεν είναι δυνατή.",

    verificationEmailHeading: "Επαλήθευση email για την εφαρμογή «ΠοτίΖΩ»",
    verificationEmailSubject: "ΠοτίΖΩ - Επαλήθευση email",

    resetPasswordEmailHeading:
      "Αλλαγή κωδικού σύνδεσης για την εφαρμογή «ΠοτίΖΩ»",
    resetPasswordEmailSubject: "ΠοτίΖΩ - Αλλαγή κωδικού σύνδεσης",

    wateringNotificationEmailSubject: "ΠοτίΖΩ - Υπενθύμιση ποτίσματος δέντρων",
    wateringNotificationEmailHeading: "Υπενθύμιση ποτίσματος δέντρων",
  },
};

module.exports = greekTranslations;
