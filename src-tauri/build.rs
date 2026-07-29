use std::env;
use std::fs;
use std::path::PathBuf;

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    let native_dir = PathBuf::from(&manifest_dir).join("native");
    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap_or_default();

    println!("cargo:rustc-link-search=native={}", native_dir.display());

    if target_os == "windows" {
        println!("cargo:rustc-link-lib=libbloom");

        let lib_path = native_dir.join("libbloom.lib");
        let dll_path = native_dir.join("libbloom.dll");

        println!("cargo:rerun-if-changed={}", lib_path.display());
        println!("cargo:rerun-if-changed={}", dll_path.display());

        if let Ok(out_dir) = env::var("OUT_DIR") {
            let out_path = PathBuf::from(out_dir);
            if let Some(target_dir) = out_path.ancestors().nth(3) {
                let dest_dll = target_dir.join("libbloom.dll");
                if dll_path.exists() {
                    let _ = fs::copy(&dll_path, &dest_dll);
                }
            }
        }
    } else if target_os == "macos" {
        println!("cargo:rustc-link-lib=static=bloom");

        println!("cargo:rustc-link-lib=framework=Security");

        let a_path = native_dir.join("libbloom.a");
        let h_path = native_dir.join("libbloom.h");

        println!("cargo:rerun-if-changed={}", a_path.display());
        println!("cargo:rerun-if-changed={}", h_path.display());

        let dummy_dll = native_dir.join("libbloom.dll");
        if !dummy_dll.exists() {
            let _ = fs::write(&dummy_dll, "");
        }
    } else {
        println!("cargo:rustc-link-lib=bloom");
    }

    tauri_build::build();
}
