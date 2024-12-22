import Foundation
import SwiftUI
import UIKit

@objc(MySwiftUIScreenManager)
class MySwiftUIScreenManager: RCTEventEmitter {
  
  override func supportedEvents() -> [String]! {
     return ["onSwiftUIEvent"]
   }
  
  @objc func presentSwiftUIScreen(_ message: NSString) {
    DispatchQueue.main.async {
      if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
        let swiftUIScreen = UIHostingController(
          rootView: MySwiftUIScreen( callback: {
            self.removeSwiftUIScreen()
            self.sendEventToReact() // Call the instance method instead of a static method
          })
        )
        swiftUIScreen.modalPresentationStyle = .fullScreen;
        rootVC.present(swiftUIScreen, animated: true, completion: nil)
      }
    }
  }
  
  @objc func removeSwiftUIScreen() {
    DispatchQueue.main.async {
      if let rootVC = UIApplication.shared.delegate?.window??.rootViewController {
        rootVC.dismiss(animated: true, completion: nil)
      }
    }
  }
  
  private func sendEventToReact() {
    self.sendEvent(withName: "onSwiftUIEvent", body: ["message": ""])
  }
  
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
