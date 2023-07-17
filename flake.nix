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
      # npx is used by hugo to run postcss. Using a mock because we get errors when using it.
      npxMock = pkgs.writeShellScriptBin "npx" ''
        #!/bin/sh
        # Skip the --no-install. This is a npx argument that we don't need to handle
        shift
        # Execute the remaining command & args
        "$@"
      '';
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
          npxMock
        ];
        buildPhase = ''
          # add to path so hugo can use postcss
          export PATH=$PATH:$(pwd)/node_modules/.bin
          ln -sf ${yarnEnv}/libexec/muscat-tech.org/node_modules node_modules
          ${pkgs.yarn}/bin/yarn build
          ${pkgs.hugo}/bin/hugo -F --minify --logLevel info
        '';
        installPhase = ''
          mkdir -p $out
          cp -r public $out/public
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
