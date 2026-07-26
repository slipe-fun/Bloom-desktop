use std::env;
use std::fs;
use std::path::PathBuf;

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").unwrap();
    let lib_dir = PathBuf::from(&manifest_dir).join("libs");

    println!("cargo:rustc-link-search=native={}", lib_dir.display());
    
    println!("cargo:rustc-link-lib=libbloom");

    println!("cargo:rerun-if-changed=libs/libbloom.lib");
    println!("cargo:rerun-if-changed=libs/libbloom.dll");

    if let Ok(out_dir) = env::var("OUT_DIR") {
        let out_path = PathBuf::from(out_dir);
        if let Some(target_dir) = out_path.ancestors().nth(3) {
            let src_dll = lib_dir.join("libbloom.dll");
            let dest_dll = target_dir.join("libbloom.dll");

            if src_dll.exists() {
                let _ = fs::copy(&src_dll, &dest_dll);
            }
        }
    }

    tauri_build::build();
}