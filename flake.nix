{
  description = "muscat-tech.org";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {inherit system;};
    in {
      packages.default = pkgs.stdenv.mkDerivation {
        name = "muscat-tech.org";
        src = ./.;
        buildInputs = [
          pkgs.hugo
          pkgs.nodePackages.yarn
        ];
        buildPhase = ''
          ${pkgs.hugo}/bin/hugo -v
        '';
        installPhase = ''
          cp -r public $out
        '';
      };

      devShells.default = pkgs.mkShell {
        packages = with pkgs; [
          hugo
          yarn
        ];
      };
    });
}
