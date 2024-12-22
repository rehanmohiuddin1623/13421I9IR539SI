//
//  CameraView.swift
//  photogram
//
//  Created by Rehan Mohiuddin on 12/12/24.
//

import Foundation
import SwiftUI
import UIKit


struct CameraView: UIViewControllerRepresentable {
    @Binding var image: UIImage?

    // ✅ Required method 1: Create and configure UIImagePickerController
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = .camera // Use camera instead of photo library
        picker.delegate = context.coordinator // Assign the delegate
        return picker
    }

    // ✅ Required method 2: Update the view controller if required
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {
        // This method can be left empty unless you want to update the view controller's state
    }

    // ✅ Required method 3: Create a Coordinator to handle delegation
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    // MARK: - Coordinator to Handle UIImagePickerControllerDelegate
    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: CameraView

        init(_ parent: CameraView) {
            self.parent = parent
        }

        // Called when the user captures an image
        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image // Pass the captured image to the parent view
            }
            picker.dismiss(animated: true)
        }

        // Called when the user cancels the image picker
        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            picker.dismiss(animated: true)
        }
    }
}
