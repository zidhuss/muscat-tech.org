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
      yarnEnv = pkgs.mkYarnPackage {
        src = ./.;
      };
      gitRev =
        if (builtins.hasAttr "rev" self)
        then self.shortRev
        else "dirty";
    in {
      packages.default = pkgs.stdenv.mkDerivation {
        pname = "muscat-tech.org";
        version = gitRev;
        src = ./.;
        buildInputs = [
          pkgs.hugo
          yarnEnv
          pkgs.yarn
        ];
        buildPhase = ''
          ln -sf ${yarnEnv}/libexec/muscat-tech.org/node_modules node_modules
          ${pkgs.yarn}/bin/yarn build
          ${pkgs.hugo}/bin/hugo -F --minify --logLevel info
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
