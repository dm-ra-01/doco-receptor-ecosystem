---
sidebar_position: 10
---

# CI/CD Pipeline

The **Rotator Worker** (Flutter Legacy) application uses [Codemagic](https://codemagic.io/) for Continuous Integration and Deployment.

## Configuration

The pipeline is defined in `codemagic.yaml` at the root of the `frontend/rotator_worker` repository.

:::info
This pipeline handles both **Testing** and **iOS Deployment** to TestFlight.
:::

## Workflows

### 1. TEST ONLY

**Trigger:**
- On every `push` to any branch (excluding `main`).
- Tag patterns matching `*`.

**Steps:**
1.  `flutter packages pub get`
2.  `flutter test --dart-define ENV=dev`

**Artifacts:**
- Drive logs (`flutter_drive.log`)

### 2. DEPLOY (Main)

**Trigger:**
- On `push` to `main` branch.
- Tag patterns matching `*`.

**Environment Variables:**
- `ENV`: test
- `PROVISIONING_PROFILE`: (Encrypted)
- `CERTIFICATE`: (Encrypted)
- `App Store Connect API Key`: (Encrypted)

**Steps:**
1.  **Test**: Runs unit tests (`flutter test`).
2.  **Install Dependencies**: `pod install` for iOS.
3.  **Signing**:
    - Decodes and installs the Provisioning Profile.
    - Decodes and adds the iOS Signing Certificate to the keychain.
4.  **Build**:
    - `flutter build ipa --export-options-plist=$HOME/export_options.plist`
5.  **Publish**:
    - **TestFlight**: Automatically submits to TestFlight (`submit_to_testflight: true`).
    - **Email**: Notifies `ryan.amoeba@enlocated.com`.

## Secrets Management

Secrets (Certificates, Profiles, API Keys) are stored as **Encrypted** strings within the `codemagic.yaml` file. These can only be decrypted by Codemagic's build servers during execution.

## Artifacts

Successful builds generate the following artifacts:
- `.ipa` files (iOS App Store Package)
- Xcode build logs
- Flutter drive logs
