KiddoPaint.Submenu.pencil = [{
        name: 'Size 1',
        imgSrc: 'img/pw1.png',
        handler: function() {
            KiddoPaint.Tools.Pencil.size = 1;
        }
    },
    {
        name: 'Size 5',
        imgSrc: 'img/pw2.png',
        handler: function() {
            KiddoPaint.Tools.Pencil.size = 5;
        }
    },
    {
        name: 'Size 10',
        imgSrc: 'img/pw3.png',
        handler: function() {
            KiddoPaint.Tools.Pencil.size = 10;
        }
    },
    {
        name: 'Size 25',
        imgSrc: 'img/pw4.png',
        handler: function() {
            KiddoPaint.Tools.Pencil.size = 25;
        }
    },
    {
        name: 'Size 100',
        imgSrc: 'img/pw5.png',
        handler: function() {
            KiddoPaint.Tools.Pencil.size = 100;
        }
    },

    {
        name: 'spacer',
        invisible: true,
        handler: true
    },

    {
        name: 'Texture 1',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Solid)
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Solid(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 2',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Partial1);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Partial1(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 3',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Partial2);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Partial2(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 4',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Partial3);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Partial3(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 5',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Smiley);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Current.modifiedAlt ? KiddoPaint.Textures.RSmiley() : KiddoPaint.Textures.Smiley(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 6',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.PartialSquares);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.PartialSquares(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 7',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Speckles);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Speckles(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 8',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Bubbles);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Bubbles(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 9',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Diamond);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Diamond(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 10',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Sand);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Sand(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 11',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Brick);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Brick(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 12',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.CornerStair);
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.CornerStair(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Texture 13',
        imgJs: function() {
            return makeIcon(KiddoPaint.Textures.Houndstooth)
        },
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.Houndstooth(KiddoPaint.Current.color);
            }
        }
    },
    {
        name: 'Rainbow',
        emoji: '🌈',
        handler: function() {
            KiddoPaint.Tools.Pencil.texture = function() {
                return KiddoPaint.Textures.RSolid();
            }
        }
    }
];