pragma solidity ^0.8.6;

contract EvermoreFile {
    struct File{
        string path;
        string hash;
    }

    struct User {
        File[] files;
    }

    mapping(address => User) userStructs;
}