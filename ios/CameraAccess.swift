import AVFoundation

func configureCamera() {
    guard let device = AVCaptureDevice.default(for: .video) else { return }
    
    do {
        try device.lockForConfiguration()
        
        // Set zoom to 1.0 (no zoom)
        device.videoZoomFactor = 1.0
        
        device.unlockForConfiguration()
    } catch {
        print("Error configuring camera: \(error)")
    }
}

func checkCameraPermission() {
    let cameraAuthorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
  configureCamera()
    switch cameraAuthorizationStatus {
    case .notDetermined:
        // The user has not been prompted yet, request access
        AVCaptureDevice.requestAccess(for: .video) { granted in
            if granted {
                print("✅ Camera access granted.")
            } else {
                print("❌ Camera access denied.")
            }
        }
    case .restricted, .denied:
        print("❌ Camera access denied. Show alert or guide the user to settings.")
        openSettings()
    case .authorized:
        print("✅ Camera access authorized.")
    @unknown default:
        print("🚩 Unknown status.")
    }
}

func openSettings() {
    if let settingsUrl = URL(string: UIApplication.openSettingsURLString) {
        if UIApplication.shared.canOpenURL(settingsUrl) {
            UIApplication.shared.open(settingsUrl)
        }
    }
}
