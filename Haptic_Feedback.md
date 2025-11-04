Haptics ke Types

expo-haptics me multiple feedback types hain:


🔹 Impact Feedback (chhoti vibration)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);


🔹 Notification Feedback (success, warning, error)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);


🔹 Selection Feedback (subtle feedback, e.g., sliders)
Haptics.selectionAsync();


🔹 Vibration Pattern (Custom pattern)
Haptics.vibrateAsync(Haptics.VibrationPattern.Heavy);






