#include "caff.hpp"
#include <iostream>

using namespace std;

CAFF::CAFF(vector<string> caffFile){
    for(size_t i = 0; i<caffFile.size(); ++i) {
        cout << caffFile[i];
    }
}